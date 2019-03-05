var mysql = require('mysql');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "reeas",
  database: "reeas_db"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("SELECT * FROM Events_Record", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    var resultJSON = JSON.stringify(result);
    console.log(resultJSON);
    fs.writeFile('result.json', resultJSON,  function(err, result) {
     if(err) console.log('error', err);
    });
  }); 
});
