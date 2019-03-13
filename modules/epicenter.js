const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../scripts/calculator');

//prepare query
const sql1 = "SELECT DISTINCT sensor_id, timestamp FROM Displacement_Record WHERE wave_type = 0";
const sql2 = "SELECT timestamp FROM Displacements_Record WHERE wave_type = 1 && sensor_id = ?";
const sql3 = "SELECT latitude, longitude FROM Sensors_Record WHERE sensor_id = ?";
var timeDifference, pTime, sTime;

//connect to database
db.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(sql1, function (err, res, fields) {
        if (err) throw err;
        for(i=0; i<res.length; i++){
            sensor = res[i].sensor_id;
            pTime = res[i].timestamp;
            sql2 = mysql.format(sql2, sensor_id)
            conn.query(sql2, function(err, res, fields){
                if (err) throw err;
                sTime = res[i].timestamp;
            });
            conn.query(sql3, function(err, res, fields){
                if (err) throw err;
                
            });
        }
    });
});