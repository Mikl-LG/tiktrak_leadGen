const database = require('../database');

api = {

    getNatures : async(body) => {
        const natures = await database.natures.get({
            body : body
        })
        natures && console.log('Natures sended to user');
        return(natures);
    },
    getNaturesFeatures : async(body) => {
        const naturesFeatures = await database.naturesFeatures.get({
            body : body
        })
        naturesFeatures && console.log('Natures features sended to user');
        return(naturesFeatures);
    } 
}

module.exports = api;