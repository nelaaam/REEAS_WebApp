
const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT status,sample FROM Events WHERE event = ? ORDER BY sample DESC;";
        values = msg.event;
        conn.query(sql1, values, (err, res) => {
            if (err) throw err;
            var sample = res[0].sample;
            var sql2 = "UPDATE Events SET status = ? WHERE event = ? AND status IS NULL;";
            var values = [msg.status, msg.event];
            conn.query(sql2, values, (err, res) => {
                if (err) throw err;
                if (res.affectedRows > 0) {
                    setTimeout(checkAlerts, 120000, conn, msg.event, sample);

                }
            });
        });
    });
});

function checkAlerts(conn, event, old_sample) {
    conn.query("SELECT sample FROM Events WHERE event = ? ORDER BY sample DESC", event, (err, res) => {
        if (err) throw err;
        if (old_sample == res[0].sample) {
            conn.query('SELECT * FROM Alerts WHERE event = ? ORDER BY alert DESC LIMIT 1', event, (err, res) => {
                var values = [res[0].event, res[0].datetime, res[0].latitude, res[0].longitude, res[0].magnitude, res[0].location];
                conn.query('INSERT INTO Earthquakes (event, datetime, latitude, longitude, magnitude, location) VALUES (?,?,?,?,?,?)', values, (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows > 0) {
                        conn.release();
                        process.exit();
                    }
                });
            });
        } else {
            conn.release();
            process.exit();
        }
    });
}


