var async = require("async");
const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../scripts/calculator');
var i;
//prepare query
var sql1 = "SELECT DISTINCT sensor_id, timestamp FROM Displacement_Record WHERE wave_type = 1 ORDER BY timestamp ASC";
var sql2 = "SELECT timestamp FROM Displacement_Record WHERE wave_type = 0 AND sensor_id = ?";
var sql3 = "SELECT latitude, longitude FROM Sensor_Record WHERE sensor_id = ?";
var i = 0, sensor = [], pTime = [], sTime = [], location = [], pTimestamp = [], sTimestamp = [], pTimeDifference = [], sTimeDifference = [];
var sensorPromise, timestampPromise;
//connect to database
db.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(sql1, function (err, res, fields) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            sensor[i] = res[i].sensor_id;
            pTimestamp[i] = res[i].timestamp;
        }
        let getTimePromise = new Promise(function (resolve, reject) {
            async.forEachOfSeries(sensor, function (id, index, callback) {
                sql2 = mysql.format(sql2, id);
                conn.query(sql2, function (err, result) {
                    if (err) return reject(err);
                    sTime[index] = result[0].timestamp;
                    if (index == 2) resolve(sTime);
                    callback();
                });
            }, function done() {
                console.log("Done");
            });
        });
        let getSensorPromise = new Promise(function (resolve, reject) {
            async.forEachOfSeries(sensor, function (id, index, callback) {
	console.log("id init = " + id);
	console.log("id = " + id);
	console.log(sql3);
	console.log("index = " + index);
                conn.query(sql3, id, function (err, result) {
                    if (err) {
                        return reject(err);
                    }
	console.log(result);
                    location[index] = [result[0].latitude, result[0].longitude];
                    if (index == 2) resolve(location);
                    callback();
                });
            }, function done() {
                console.log("Done");
            });
        });
        getSensorPromise.then(function (sensor) {
            getTimePromise.then(function (time) {
                var sTimestamp = time;
                var sensorPromise = sensor;
		console.log(sensorPromise[0]);
		console.log(sensorPromise[1]);
                var d1 = calculator.getCoordinateDistance(sensorPromise[0], sensorPromise[1]);
                var d2 = calculator.getCoordinateDistance(sensorPromise[0], sensorPromise[2]);
                var d3 = calculator.getCoordinateDistance(sensorPromise[1], sensorPromise[2]);
        
                for (i = 0; i < res.length; i++) {
                    pTime[i] = convertToTime(pTimestamp[i]);
                    sTime[i] = convertToTime(sTimestamp[i]);
                }
        
                pTimeDifference[0] = calculator.getTimeDifference(pTime[0], pTime[1]);
                sTimeDifference[0] = calculator.getTimeDifference(sTime[0], sTime[1]);
                pTimeDifference[1] = calculator.getTimeDifference(pTime[0], pTime[2]);
                sTimeDifference[1] = calculator.getTimeDifference(sTime[0], sTime[2]);
                pTimeDifference[2] = calculator.getTimeDifference(pTime[1], pTime[2]);
                sTimeDifference[2] = calculator.getTimeDifference(sTime[1], sTime[2]);
        
                console.log(d1);
                console.log(pTimeDifference[0]);
                 eVelocity = calculator.getEstimatedVelocity(d1, pTimeDifference[0] / 1000);
		console.log(eVelocity);

            });
        });
    });
    conn.release();
});
function convertToTime(timestamp) {
    date = new Date(timestamp);
    time = date.getTime();
    return time;
}
