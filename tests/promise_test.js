var async = require("async");
const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../scripts/calculator');
var i;
//prepare query
let sql1 = "SELECT DISTINCT station, datetime FROM Displacements WHERE wave = 0 ORDER BY datetime ASC LIMIT 3";
let sql2 = "SELECT pgd, datetime FROM Displacemets WHERE wave = 1 AND station = ? ORDER BY datetime ASC LIMIT 3";
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
		console.log("Promise fulfilled");
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
