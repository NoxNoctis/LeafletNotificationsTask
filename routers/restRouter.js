var router = require('express').Router();
var request = require('request');

var dest = 'http://test-notifications.staging.waze.com';
var path = '';
router.get('/notifications', function (req, res) {
    path = '/notifications.json';
    request(dest + path, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    });
});


router.get('/notifications/updates', function(req, res){
    var path='/notifications/updates.json';//"2015-05-01T18:00:22.848Z"
    var since = req.query.since;
    request.get({url:dest + path, form:{"since":since}}, function (error, response, body) {
        //console.log(""+new Date() + "got update since "+since + ": "+body);
        res.send(body);
    });
});

router.post('/notifications', function (req, res) {
    path = '/notifications.json';
    var notification = req.body;
    request.post(dest + path).form({
        "notification[title]": notification.title,
        "notification[description]": notification.description,
        "notification[lon]": notification.lon,
        "notification[lat]": notification.lat
    }).on('response', function(response){
        res.send(response);
    });

    console.log(""+new Date() + "created new notification: " + notification);
});


router.put('/notifications/:id', function(req, res){
    path = '/notifications/'+ req.params.id;
    var notification = req.body;
    request.put(dest + path).form({
        "notification[title]": notification.title,
        "notification[description]": notification.description,
        "notification[lon]": notification.lon,
        "notification[lat]": notification.lat
    }).on('response', function(response){
        res.send(response);
    });
});


router.delete('/notifications/:id', function(req, res){
    console.log('deleting: '+ req.params.id);
    path =  '/notifications/:id'.replace(':id', req.params.id);
    request.del(dest+path).on('response', function(response){
        res.send(response);
    });
});


router.put('/notifications/:id([0-9]+)/upvote', function(req, res){
    console.log(""+new Date() + 'upvoting: '+ req.params.id);
    path =  '/notifications/:id/upvote'.replace(':id', req.params.id);
    request.put(dest+path).on('response', function(response){
        res.send(response);
    });
});


module.exports = router;
