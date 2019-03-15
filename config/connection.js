var mysql = require('mysql');
const config = require('./db_config');

var pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 50,
    connectTimeout: config.get('db_timeout'),
    host: config.get('db_host'),
    user: config.get('db_user'),
    password: config.get('db_pass'),
    database: config.get('db_name'),
 });

module.exports = pool;
