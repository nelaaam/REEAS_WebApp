

var mysql = require('mysql');
const config = require('./db_config');

var pool = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: config.get('db_timeout'),
    host: config.get('db_host'),
    user: config.get('db_user'),
    password: config.get('db_pass'),
    database: config.get('db_name'),
 });
  
  pool.getConnection(function(err) {
      if (err) throw err;
      else console.log('Connection variable created.');
  });
    
  pool.on('error', function(err) {
      console.log(err.code);
    });
    
  module.exports = pool;
