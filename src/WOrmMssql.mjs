import Sequelize from 'sequelize'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import map from 'lodash/map'
import each from 'lodash/each'
import size from 'lodash/size'
import genPm from 'wsemi/src/genPm.mjs'
import genID from 'wsemi/src/genID.mjs'
import isarr from 'wsemi/src/isarr.mjs'
import isobj from 'wsemi/src/isobj.mjs'
import isbol from 'wsemi/src/isbol.mjs'
import strright from 'wsemi/src/strright.mjs'
import pmSeries from 'wsemi/src/pmSeries.mjs'
import importModels from './importModels.mjs'


/**
 * 操作資料庫(Microsoft SQL)
 *
 * @class
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.url='mssql://localhost:1433'] 輸入連接資料庫字串，預設'mssql://localhost:1433'
 * @param {String} [opt.db='worm'] 輸入使用資料庫名稱字串，預設'worm'
 * @param {String} [opt.cl='test'] 輸入使用資料表名稱字串，預設'test'
 * @param {String} [opt.fdModels='models'] 輸入資料表models(各檔為*.js)所在資料夾字串，預設'models'
 * @param {Boolean} [opt.logging=false] 輸入是否輸出實際執行的sql指令，預設false
 * @param {String} [opt.pk='id'] 輸入數據主鍵字串，預設'id'
 * @param {Boolean} [opt.autoGenPK=true] 輸入若數據pk(id)欄位沒給時則自動給予隨機uuid，預設true
 * @returns {Object} 回傳操作資料庫物件，各事件功能詳見說明
 */
function WOrmMssql(opt = {}) {


    //default
    if (!opt.url) {
        opt.url = 'mssql://localhost:1433'
    }
    if (!opt.db) {
        opt.db = 'worm'
    }
    if (!opt.cl) {
        opt.cl = 'test'
    }
    if (!opt.fdModels) {
        opt.fdModels = 'models'
    }
    if (strright(opt.url, 1) !== '/') {
        opt.url += '/' + opt.db
    }
    opt.logging = (opt.logging === true)
    if (!opt.pk) {
        opt.pk = 'id'
    }
    if (!isbol(opt.autoGenPK)) {
        opt.autoGenPK = true
    }


    //sequelize
    let sequelize = new Sequelize(opt.url, {
        define: {
            timestamps: false
        },
        logging: opt.logging,
    })


    //mds
    let mds = importModels(opt.fdModels, sequelize)


    //Op
    let Op = Sequelize.Op
    //console.log('Op', Op)


    /**
     * 查詢數據
     *
     * @memberOf WOrmMssql
     * @param {Object} [find={}] 輸入查詢條件物件
     * @returns {Promise} 回傳Promise，resolve回傳數據，reject回傳錯誤訊息
     */
    async function select(find = {}) {

        function cvObj(o) {
            let oNew = {}
            each(o, (v, k) => {
                let kNew = k
                if (k.indexOf('$') >= 0) {
                    k = k.replace('$', '')
                    if (k === 'regex') {
                        kNew = Op.substring
                    }
                    else if (k === 'options') {
                        kNew = null
                    }
                    else if (k === 'nin') {
                        kNew = Op.notIn
                    }
                    else {
                        kNew = Op[k]
                    }
                }
                let vNew = v
                if (isarr(v)) {
                    vNew = cvArray(v)
                }
                else if (isobj(v)) {
                    vNew = cvObj(v)
                }
                if (kNew !== null) {
                    oNew[kNew] = vNew
                }
            })
            return oNew
        }

        function cvArray(o) {
            let oNew = []
            each(o, (v) => {
                let vNew = v
                if (isarr(v)) {
                    vNew = cvArray(v)
                }
                else if (isobj(v)) {
                    vNew = cvObj(v)
                }
                oNew.push(vNew)
            })
            return oNew
        }

        function cvFind(o) {
            let oNew = {}
            if (isobj(o)) {
                oNew = cvObj(o)
            }
            else {
                console.log('select: find is not object')
            }
            return oNew
        }

        //useFind
        let useFind = cvFind(find)

        //md
        let md = mds[opt.cl]

        //findAll
        let rs = await md.findAll({
            where: useFind,
            raw: true,
        })

        return rs
    }


    /**
     * 插入數據，插入同樣數據會自動產生不同_id，故insert前需自行判斷有無重複
     *
     * @memberOf WOrmMssql
     * @param {Object|Array} data 輸入數據物件或陣列
     * @returns {Promise} 回傳Promise，resolve回傳插入結果，reject回傳錯誤訊息
     */
    async function insert(data) {

        //cloneDeep
        data = cloneDeep(data)

        //pm
        let pm = genPm()

        //md
        let md = mds[opt.cl]

        //check
        if (!isarr(data)) {
            data = [data]
        }

        //check
        if (opt.autoGenPK) {
            data = map(data, function(v) {
                if (!v[opt.pk]) {
                    v[opt.pk] = genID()
                }
                return v
            })
        }

        //bulkCreate
        md.bulkCreate(data)
            .then((res) => {
                //console.log('bulkCreate then',res)
                pm.resolve({ n: size(data), ok: 1 })
            })
            .catch(({ original }) => {
                //console.log('bulkCreate catch',original)
                pm.reject({ n: 0, ok: 0 })
            })

        return pm
    }


    /**
     * 儲存數據
     *
     * @memberOf WOrmMssql
     * @param {Object|Array} data 輸入數據物件或陣列
     * @param {Object} [option={}] 輸入設定物件，預設為{}
     * @param {boolean} [option.autoInsert=true] 輸入是否於儲存時發現原本無數據，則自動改以插入處理，預設為true
     * @param {boolean} [option.atomic=false] 輸入是否於儲存時採用上鎖，避免同時操作互改問題，預設為false
     * @returns {Promise} 回傳Promise，resolve回傳儲存結果，reject回傳錯誤訊息
     */
    async function save(data, option = {}) {

        //cloneDeep
        data = cloneDeep(data)

        //autoInsert, atomic
        let autoInsert = get(option, 'autoInsert', true)
        let atomic = get(option, 'atomic', false)

        //pm
        let pm = genPm()

        //md
        let md = mds[opt.cl]

        //check
        if (!isarr(data)) {
            data = [data]
        }

        //check
        if (opt.autoGenPK) {
            data = map(data, function(v) {
                if (!v[opt.pk]) {
                    v[opt.pk] = genID()
                }
                return v
            })
        }

        //tr
        let t = null
        let tr = {}
        if (atomic) {
            t = await sequelize.transaction()
            tr = {
                transaction: t
            }
        }

        //pmSeries
        pmSeries(data, async function(v) {
            let pmm = genPm()

            //err
            let err = null

            //r
            let r
            if (v[opt.pk]) {
                //有id

                //findOne
                r = await md.findOne({
                    where: { [opt.pk]: v[opt.pk] },
                    raw: true,
                })
                    .catch((error) => {
                        err = error
                    })

            }
            else {
                //沒有id
                err = `${opt.pk} is invalid`
            }

            if (r) {
                //有找到資料

                let rr = await md.update(v, {
                    where: { [opt.pk]: v[opt.pk] },
                    ...tr,
                })
                    .catch((error) => {
                        err = error
                    })

                if (rr) {
                    //console.log('update 有更新資料', rr)
                    pmm.resolve({ n: 1, nModified: 1, ok: 1 })
                }
                else {
                    //console.log('update 沒有更新資料', err)
                    pmm.resolve({ n: 0, nInserted: 0, ok: 1 })
                }

            }
            else {
                //沒有找到資料

                //autoInsert
                if (autoInsert) {

                    //create
                    let rr = await md.create(v, tr)
                        .catch((error) => {
                            err = error
                        })

                    if (rr) {
                        //console.log('create 有插入資料', rr)
                        pmm.resolve({ n: 1, nInserted: 1, ok: 1 })
                    }
                    else {
                        //console.log('create 沒有插入資料', err)
                        pmm.resolve({ n: 0, nInserted: 0, ok: 1 })
                    }

                }
                else {
                    //console.log('findOne 沒有找到資料也不自動插入', err)
                    pmm.resolve({ n: 0, nModified: 0, ok: 1 })
                }

            }

            pmm._err = err //避免eslint錯誤訊息
            return pmm
        })
            .then((res) => {
                pm.resolve(res)
                if (t) {
                    //console.log('transaction commit')
                    return t.commit()
                }
            })
            .catch((res) => {
                pm.reject(res)
                if (t) {
                    //console.log('transaction rollback')
                    return t.rollback()
                }
            })

        return pm
    }


    /**
     * 刪除數據
     *
     * @memberOf WOrmMssql
     * @param {Object|Array} data 輸入數據物件或陣列
     * @returns {Promise} 回傳Promise，resolve回傳刪除結果，reject回傳錯誤訊息
     */
    async function del(data) {

        //cloneDeep
        data = cloneDeep(data)

        //pm
        let pm = genPm()

        //md
        let md = mds[opt.cl]

        //check
        if (!isarr(data)) {
            data = [data]
        }

        //pmSeries
        pmSeries(data, async function(v) {
            let pmm = genPm()

            //err
            let err = null

            //r
            let r
            if (v[opt.pk]) {
                //有id

                //findOne
                r = await md.findOne({
                    where: { [opt.pk]: v[opt.pk] },
                    raw: true,
                })
                    .catch((error) => {
                        err = error
                    })

            }
            else {
                //沒有id
                err = `${opt.pk} is invalid`
            }

            if (r) {
                //有找到資料

                //destroy
                let rr = await md.destroy({
                    where: { [opt.pk]: v[opt.pk] },
                })
                    .catch((error) => {
                        err = error
                    })

                if (rr) {
                    //console.log('destroy 有刪除資料', rr)
                    pmm.resolve({ n: 1, nDeleted: 1, ok: 1 })
                }
                else {
                    //console.log('destroy 沒有刪除資料', err)
                    pmm.resolve({ n: 0, nDeleted: 0, ok: 1 })
                }

            }
            else {
                //console.log('findOne 沒有找到資料', err)
                pmm.resolve({ n: 1, nDeleted: 1, ok: 1 })
            }

            pmm._err = err //避免eslint錯誤訊息
            return pmm
        })
            .then((res) => {
                pm.resolve(res)
            })
            .catch((res) => {
                pm.reject(res)
            })

        return pm
    }


    /**
     * 刪除全部數據，需與del分開，避免未傳數據導致直接刪除全表
     *
     * @memberOf WOrmMssql
     * @param {Object} [find={}] 輸入刪除條件物件
     * @returns {Promise} 回傳Promise，resolve回傳刪除結果，reject回傳錯誤訊息
     */
    async function delAll(find = {}) {

        //pm
        let pm = genPm()

        //md
        let md = mds[opt.cl]

        //destroy
        md.destroy({
            where: find,
        })
            .then((res) => {
                pm.resolve({ n: res, ok: 1 })
            })
            .catch((res) => {
                pm.reject({ n: 0, ok: 1 })
            })

        return pm
    }


    return {
        select,
        insert,
        save,
        del,
        delAll,
    }
}


export default WOrmMssql
