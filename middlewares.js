var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mainRouter = require('./routers/mainRouter');

module.exports = {configure: function(app){
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(mainRouter);
}};