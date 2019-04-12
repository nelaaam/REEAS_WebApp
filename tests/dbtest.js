var mysql = require('mysql');

const timeout = 5000;
const host = "35.184.68.56";
const user = "root";
const pass = "reeas";
const name = "reeas_db";

var db= mysql.createConnection({
    multipleStatements: true,
    connectionLimit: 50,
    connectTimeout: timeout,
    host: host,
    user: user,
    password: pass,
    database: name,
 });


db.connect((err) => {
	if (err) throw err;
	else console.log("connected!");
	connection.end();
});

