const database = require('../database');

api = {

    getNatures : async(body) => {
        const natures = await database.natures.get({
            body : body
        })
        return(natures);
    },
    getNaturesFeatures : async(body) => {
        const naturesFeatures = await database.naturesFeatures.get({
            body : body
        })
        return(naturesFeatures);
    } 
}

module.exports = api;