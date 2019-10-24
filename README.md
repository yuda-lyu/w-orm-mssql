# w-orm-mssql
An object of operator for MSSQL in nodejs, like a simple ORM.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-orm-mssql.svg?style=flat)](https://npmjs.org/package/w-orm-mssql) 
[![Build Status](https://travis-ci.org/yuda-lyu/w-orm-mssql.svg?branch=master)](https://travis-ci.org/yuda-lyu/w-orm-mssql) 
[![license](https://img.shields.io/npm/l/w-orm-mssql.svg?style=flat)](https://npmjs.org/package/w-orm-mssql) 
[![gzip file size](http://img.badgesize.io/yuda-lyu/w-orm-mssql/master/dist/w-orm-mssql.umd.js.svg?compression=gzip)](https://github.com/yuda-lyu/w-orm-mssql)
[![npm download](https://img.shields.io/npm/dt/w-orm-mssql.svg)](https://npmjs.org/package/w-orm-mssql) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-orm-mssql.svg)](https://www.jsdelivr.com/package/npm/w-orm-mssql)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-orm-mssql/WOrm.html).

## Installation
### Using npm(ES6 module):
> **Note:** `w-orm-mssql` depends on `sequelize`, `mssql`, `async` and `eslint`.

```alias
npm i w-orm-mssql
```
#### Example for the table in database
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-orm-mssql/blob/master/g.mjs)]
```alias
import wo from 'w-orm-mssql'

let username = 'username'
let password = 'password'
let opt = {
    url: `mssql://${username}:${password}@localhost`,
    db: 'worm',
    cl: 'users',
    fdModels: 'models',
    //autoGenPK: false,
}

let rs = [
    {
        id: 'id-peter',
        name: 'peter',
        value: 123,
    },
    {
        id: 'id-rosemary',
        name: 'rosemary',
        value: 123.456,
    },
    {
        id: '',
        name: 'kettle',
        value: 456,
    },
]

let rsm = [
    {
        id: 'id-peter',
        name: 'peter(modify)'
    },
    {
        id: 'id-rosemary',
        name: 'rosemary(modify)'
    },
    {
        id: '',
        name: 'kettle(modify)'
    },
]

async function test() {


    //w
    let w = wo(opt)


    //genModels, disable if got models
    await w.genModels({
        username: 'username',
        password: 'password',
        // dialect: 'mssql', //default
        // host: 'localhost', //default
        // port: 1433, //default
        // database from opt.db
        // directory from opt.fdModels
    })


    //on
    w.on('change', function(mode, data, res) {
        console.log('change', mode)
    })


    //delAll
    await w.delAll()
        .then(function(msg) {
            console.log('delAll then', msg)
        })
        .catch(function(msg) {
            console.log('delAll catch', msg)
        })
    // => delAll then { n: {n}, ok: 1 }


    //insert
    await w.insert(rs)
        .then(function(msg) {
            console.log('insert then', msg)
        })
        .catch(function(msg) {
            console.log('insert catch', msg)
        })
    // => insert then { n: 3, ok: 1 }


    //save
    await w.save(rsm, { autoInsert: false, atomic: true })
        .then(function(msg) {
            console.log('save then', msg)
        })
        .catch(function(msg) {
            console.log('save catch', msg)
        })
    // => save then [ { n: 1, nModified: 1, ok: 1 },
                      { n: 1, nModified: 1, ok: 1 }, 
                      { n: 0, nModified: 0, ok: 1 }, //autoInsert=false
                      { n: 1, nInserted: 1, ok: 1 }  //autoInsert=true
                    ]


    //select all
    let ss = await w.select()
    console.log('select all', ss)
    // => select all [ { id: 'id-peter', name: 'peter(modify)', value: 123 },
                       { id: 'id-rosemary', name: 'rosemary(modify)', value: 123.456 },
                       { id: '{random id}', name: 'kettle', value: 456 }, 
                       { id: '{random id}', name: 'kettle(modify)', value: null } //autoInsert=true
                    ]


    //select
    let so = await w.select({ id: 'id-rosemary' })
    // => select [ { id: 'id-rosemary', name: 'rosemary(modify)', value: 123.456 } ]


    //select by $and, $gt, $lt
    let spa = await w.select({ '$and': [{ value: { '$gt': 123 } }, { value: { '$lt': 200 } }] })
    // => select [ { id: 'id-rosemary', name: 'rosemary(modify)', value: 123.456 } ]


    //select by $or, $gte, $lte
    let spb = await w.select({ '$or': [{ value: { '$lte': -1 } }, { value: { '$gte': 200 } }] })
    // => select [ { id: '{random id}', name: 'kettle', value: 456 } ]


    //select by $and, $ne, $in, $nin
    let spc = await w.select({ '$and': [{ value: { '$ne': 123 } }, { value: { '$in': [123, 321, 123.456, 456] } }, { value: { '$nin': [456, 654] } }] })
    // => select [ { id: 'id-rosemary', name: 'rosemary(modify)', value: 123.456 } ]


    //select by regex
    let sr = await w.select({ name: { $regex: 'PeT', $options: '$i' } })
    // => select [ { id: 'id-peter', name: 'peter(modify)', value: 123 } ]


    //del
    let d = ss.filter(function(v) {
        return v.name === 'kettle'
    })
    w.del(d)
        .then(function(msg) {
            console.log('del then', msg)
        })
        .catch(function(msg) {
            console.log('del catch', msg)
        })
    // => del then [ { n: 1, nDeleted: 1, ok: 1 } ]
    

}
test()
```
