import path from 'path'
import each from 'lodash/each'
import getPathInFolder from 'wsemi/src/getPathInFolder.mjs'
import modifyModel from './modifyModel.mjs'


function importModels(fdModels, sequelize) {

    //files
    let files = getPathInFolder(fdModels)

    //fparent
    let fparent = path.dirname(path.resolve(fdModels)) + path.sep + fdModels + path.sep

    //models
    let models = {}
    each(files, (file) => {
        //console.log(file)

        //fn
        let fn = fparent + file

        //modifyModel
        modifyModel(fn)

        //import model
        let model = sequelize.import(fn)
        models[model.name] = model

    })

    return models
}


export default importModels
