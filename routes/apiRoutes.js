var express = require('express');
var router = express.Router();
const api = require('../api/api.js');

router.get('/natures',async(req,res) => {
    res.send({
        response:{
            message : await api.getNatures(req.body && req.body),
            status : 200
        }
    });
})

router.get('/naturesFeatures',async(req,res) => {
    res.send({
        response:{
            message : await api.getNaturesFeatures(req.body && req.body),
            status : 200
        }
    });
})

module.exports = router;