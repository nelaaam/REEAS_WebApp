var async = require("async");
const db = require('../config/connection');
const child = require('child_process');
var i;
//prepare query
let sql1 = "SELECT TOP 3 DISTINCT station, datetime FROM Displacements WHERE wave_type = 0 ORDER BY datetime ASC";
let sql2 = "SELECT TOP 3 pgd, datetime FROM Displacement_Record WHERE wave_type = 1 AND station = ? ORDER BY datetime ASC";
let sql3 = "SELECT latitude, longitude FROM Stations WHERE station = ?";
var i = 0, sensor = [], pTime = [], sTime = [], location = [], pTimestamp = [];
//connect to database
db.getConnection((err, conn) => {
    if (err) throw err;

    let PWaveFulfilled = new Promise((resolve, reject) => {
        var station = [], p_at = [];
        conn.query(sql1, (err, res) => {
            if (err) throw err;
            if (res[0].length < 3) {
                return reject("Not Enough Data!");
            } else {
                for (i = 0; i < res[0].length; i++) {
                    station[i] = res[0][i].station;
                    p_at[i] = res[1][i].datetime;
                }
                resolve([station, p_at]);
            }
        });
    });

    PWaveFulfilled.then((promise) => {
        let station_id = promise[0];
        let p_at = promise[1];
        let dataPrepFulfilled = new Promise((resolve, reject) => {
            async.forEachOfSeries(station_id, (id, index, callback) => {
                sql2 = mysql.format(sql2, id);
                sql3 = mysql.format(sql3, id);
                conn.query(sql2, sql3, (err, res) => {
                    if (err) return reject(err);
                    s_at[index] = res[0].datetime;
                    pgd[index] = res[0].pgd;
                    station_latitude[index] = res[1].latitude;
                    station_longitide[index] = res[1].longitude;
                    if (index == 2) {
                        resolve([s_at, pgd, station_latitude, station_longitide]);
                    }
                    callback();
                });
            }, function done() {
                console.log("Data Preparation Fulfilled.");
            });
        });
        
        dataPrepFulfilled.then((promise) => {
            let s_at = promise[0];
            let pgd = promise[1];
            var station = [[],[]], at = [[],[]];
            for (i = 0; i <= 2; i++){
                station[i] = [promise[2], promise[3]];
                at[i] = [p_at[i], s_at[i]];
            }

            const parameters = {
                stations: station,
                ats: at,
                pgds: pgd, 
            }

            let newEvent = child.fork("./information");
            newEvent.send(parameters);

            newEvent.on('message', (msg) => {
                process.send(msg);
            })

        });


    }).catch((e) => {
        console.log(e);
    });

    conn.release();
});
function convertToTime(timestamp) {
    date = new Date(timestamp);
    time = date.getTime();
    return time;
}
