var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var logger = require('morgan');
var bodyParser = require('body-parser');
var assetmanager = require('assetmanager');

var configureDatabase = require(path.join(__dirname, '/configure-mongo-connection.js'));
var enviroProperties = require(path.join(__dirname, '/../properties/environment-properties.js'));
var expressProperties = require(path.join(__dirname, '/../properties/express-properties.js'));

var core = require('./../modules/core/server/route/core-route');

var app = express();

//app.use(morgan('dev'));
app.set('showStackError', expressProperties.showStackError);
app.locals.pretty = expressProperties.localPretty;
app.locals.cache = expressProperties.localCache;

app.engine('html', consolidate[expressProperties.templateEngine]);
app.set('views', path.join(__dirname, '../'+expressProperties.views));
app.set('view engine', expressProperties.viewEngine);
app.set('superSecret', expressProperties.secret);
app.use(logger('dev'));

//app.use(expressProperties.bodyParser);
app.use(bodyParser.json(expressProperties.bodyParser.json));
app.use(bodyParser.urlencoded(expressProperties.bodyParser.urlencoded));
app.use('/bower_components', express.static(expressProperties.root + '/' + expressProperties.bowerComponents));
//app.use('/package', express.static(config.root + '/package'));
app.use(express.static(expressProperties.root));

app.use('/', core);
//app.use('/api/expense', expense);
//app.use('/api/category', category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.use(function(req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
//     // Pass to next layer of middleware
//     next();
// });

configureDatabase.connectToMongo(function(err) {
    if (err) {
        console.log("Error Connecting Mongo :: ", err);
    } else {
        console.log("Successfully connected to mongo");
    }
});

module.exports = app;
