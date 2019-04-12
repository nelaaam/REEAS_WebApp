var async = require("async");
const mysql = require('mysql');
const db = require('../config/connection');
const calculator = require('../scripts/calculator');
const opencage = require('opencage-api-client');

var i;
//prepare query
var sql1 = "SELECT DISTINCT station, datetime FROM Displacements WHERE wave = 0 ORDER BY datetime ASC LIMIT 3;";
var sql2 = "SELECT station, pgd, datetime FROM Displacements WHERE wave = 1 AND station = ? ORDER BY datetime ASC LIMIT 1;";
var sql3 = "SELECT latitude, longitude FROM Stations WHERE station = ?;";
var sql4 = "SELECT * FROM Alerts where event = ?;";
var i = 0;
//connect to database
process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql = sql1 + sql4;
        let PWaveFulfilled = new Promise((resolve, reject) => {
            conn.query(sql, msg, (err, res) => {
                if (err) throw err;
                if (res[0].length < 3) {
                    return reject("Not Enough Data!");
                } else {
                    var station = [], p_at = [];
                    for (i = 0; i < 3; i++) {
                        station[i] = res[0][i].station;
                        p_at[i] = res[0][i].datetime;
                    }
                    let promise = [station, p_at, res[1]];
                    resolve(promise);
                }
            });
        });

        PWaveFulfilled.then((promise) => {
            let event_start = promise[2].datetime;
            let station_id = promise[0];
            let p_at = promise[1];
            var s_at = [], pgd = [], station_latitude = [], station_longitude = [];
            let dataPrepFulfilled = new Promise((resolve, reject) => {
                async.forEachOfSeries(station_id, (id, index, asyncCallback) => {
                    var q1 = mysql.format(sql2, id);
                    var q2 = mysql.format(sql3, id);
                    var sql = q1 + q2;
                    conn.query(sql, (err, res) => {
                        if (err) return reject(err);
                        s_at[index] = res[0][0].datetime;
                        pgd[index] = res[0][0].pgd;
                        station_latitude[index] = res[1][0].latitude;
                        station_longitude[index] = res[1][0].longitude;
                        if (index == 2) {
                            let promise = [s_at, pgd, station_latitude, station_longitude];
                            resolve(promise);
                        }
                        asyncCallback();
                    });
                }, function done() {
                    console.log("Data Preparation Fulfilled.");
                });
            });

            dataPrepFulfilled.then((promise) => {
                let s_at = promise[0];
                let pgd = promise[1];
                var station = [[], []], at = [[], []];
                for (i = 0; i <= 2; i++) {
                    station[i] = [promise[2][i], promise[3][i]];
                    at[i] = [p_at[i], s_at[i]];
                }
                var AT = [], distance = [], MLs = [], ATs = [[], [], []];
                //PGA
                const PGD = Math.max(...pgd);
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 2; j++) {
                        ATs[i][j] = getTimeFrTimestamp(at[i][j]);
                    }
                }
                //GET S-P
                for (var i = 0; i < 3; i++) {
                    AT[i] = calculator.getDiffInSeconds(ATs[i][1], ATs[i][0]);
                    distance[i] = calculator.getSensorDistance(AT[i]);
                    if (distance[i] < 600) MLs[i] = calculator.getMagnitude(PGD, distance[i]);
                    else console.log("Can't caculate local magnitude with distance greater than 600 km");
                }
                //Get Peak Magnitude
                let ML = Math.max(...MLs);
                //GET Event Start (if not available)
                if (event_start == null) {
                    let minDistance = Math.min(...distance);
                    let earliestTime = Math.min(...p_at);
                    event_start = new Date(earliestTime - ((minDistance / 6) * 1000)).toISOString().replace('Z', '');
                }
                //Get Epicenter Coordinates
                let epicenter = calculator.trilaterate(station[0], station[1], station[2], distance);
                //GET LOCATION
                opencage.geocode({ q: epicenter[0].toString() + ", " + epicenter[1].toString(), language: 'en' }).then(data => {
                    if (data.status.code == 200) {
                        if (data.results.length > 0) {
                            var place = data.results[0];
                            const earthquake_information = {
                                event: msg,
                                datetime: event_start,
                                latitude: epicenter[0],
                                longitude: epicenter[1],
                                magnitude: ML,
                                location: place.formatted,
                            }
                            process.send(earthquake_information);
                        }
                    } else {
                        console.log('error', data.status.message);
                    }
                }).catch(error => {
                    console.log('error', error.message);
                });

            }).catch((e) => {
                console.log(e);
            });
        }).catch((e) => {
            console.log(e);
        });

        conn.release();
    });
});
function getTimeFrTimestamp(timestamp) {
    date = new Date(timestamp);
    time = date.getTime();
    return time;
}
