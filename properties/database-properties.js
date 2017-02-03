'use strict';
var mongoose = require('mongoose');

module.exports = {
  databaseName    : 'expense-tracker',
  applicationName : 'expense-tracker',
  userName        : 'expense-tracker',
  passsword       : 'expense-tracker',
  mongoUrl        : 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost')
};
