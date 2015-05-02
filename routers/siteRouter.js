var router = require('express').Router();
var path = require('path');

var siteRootFolder = path.resolve(process.cwd(), "public");


router.get('/', function(req, res){
    res.sendFile(siteRootFolder + '/index.html');
});


router.get('/*', function(req, res){
    res.sendFile(siteRootFolder + req.url);
});

module.exports = router;
