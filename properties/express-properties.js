'use-strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../');

module.exports = {
    root: rootPath,
    templateEngine  : 'ejs',
    showStackError  : true,
    secret          : 'selvav43',
    localCache      : 'memory',
    localPretty     : 'pretty',
    views           : 'modules/core/server/views',
    viewEngine      : 'html',
    bowerComponents : '/bower_components',
    bodyParser      : {
                          json: {
                              limit: '2097152',
                              type: 'application/json'
                          },
                          urlencoded: {
                              limit: '2097152',
                              extended: true
                          }
                      }
};
