const db = require('../config/connection');
const child = require('child_process');

process.on('message', (msg) => {

    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT status,sample FROM Events WHERE event = ? ORDER BY sample DESC LIMIT 1;";
        conn.query(sql1, msg.event, (err, res) => {
            if (err) throw err;
            var sample = res[0].sample;
            if (res[0].status == "False Trigger") {
                process.send(msg.event + 1);
            } else {
                if (msg.status == "Not Yet Verified") {
                    var sql2 = "UPDATE Events SET status = ? WHERE event = ?;";
                    var values = [msg.status, msg.event];
                    conn.query(sql2, values, (err, res) => {
                        if (err) throw err;
                        if (res.affectedRows > 0) {
                            setTimeout(checkAlerts, 120000, conn, msg.event, sample);
                        }
                    });
                } else if (msg.status == "Earthquake") {
                    var sql2 = "UPDATE Events SET status = ? WHERE event = ?;";
                    var values = [msg.status, msg.event];
                    conn.query(sql2, values, (err, res) => {
                        if (err) throw err;
                        if (res.affectedRows > 0) {
                            setTimeout(checkAlerts, 120000, conn, msg.event, sample);
                        }
                    });
                }
            }
        });
    });
});

function checkAlerts(conn, event, old_sample) {
    conn.query("SELECT sample,status FROM Events WHERE event = ? ORDER BY sample DESC", event, (err, res) => {
        if (err) throw err;
        if (old_sample == res[0].sample && res[0].status == "Earthquake") {
            conn.query('SELECT * FROM Alerts WHERE event = ? ORDER BY alert DESC LIMIT 1', event, (err, res) => {
                if (err) throw err;
                var values = [res[0].event, res[0].datetime, res[0].latitude, res[0].longitude, res[0].magnitude, res[0].location];
                conn.query('INSERT INTO Earthquakes (event, datetime, latitude, longitude, magnitude, location) VALUES (?,?,?,?,?,?)', values, (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows > 0) {
                        process.send("Notify");
                        conn.release();
                        process.exit();
                    }
                });
            });
        } else if (old_sample == res[0].sample && res[0].status == "Not Yet Verified") {
            conn.query('INSERT INTO False_Triggers (event, datetime) SELECT event, datetime FROM Events WHERE event = ?; UPDATE Events SET status = "False Trigger" WHERE event = ?', [event, event], (err, res) => {
                if (err) throw err;
                conn.release();
                process.exit();
            });
        } else {
            conn.release();
            process.exit();
        }
    });
}
