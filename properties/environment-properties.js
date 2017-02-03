'use-strict';


module.exports = {
  host        : process.env.HOST || 'http://localhost',
  port        : process.env.PORT || 3000,
  environment : process.env.NODE_ENV || 'development',
  buildversion: new Date()
};
