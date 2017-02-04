var mongoose = require('mongoose');
var config = require('./../properties/database-properties.js');
var mongoConnection;
module.exports = {
    connectToMongo: function(callback) {
        mongoConnection = mongoose.connect(config.mongoUrl + '/' + config.databaseName, function(err, data) {
            return callback(err);
        });
    }
};
