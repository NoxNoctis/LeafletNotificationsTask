var express = require('express');
middlewares = require('./middlewares');
http = require('http');
format = require('util').format;
log = require('util').log;


var app = express();
var server = http.Server(app);
middlewares.configure(app);


app.set('port', process.env.PORT ||3000);

server.listen(app.get('port'), function () {

    log(format('Server listening at port: %s', app.get('port')));

});

module.exports = app;