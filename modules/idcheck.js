
db = require('../config/connection');

db.getConnection((err, conn) => {
    if (err) throw err;
    conn.query("SELECT event, datetime FROM Events ORDER BY datetime DESC LIMIT 1", (err, res) => {
        if (err) throw err;
        if (res.affectedRows > 0) {
            last = new Date(res[0].datetime);
            now = new Date();
            if ((now - last) >= 120000) {
                event = res[0].event + 1;
                process.send(event);
                conn.query("SELECT status FROM Events WHERE event = ?", event, (err, res) => {
                    if (err) throw err;
                    if (res[0].status == null) {
                        conn.query("UPDATE Events SET status = ? WHERE event = ?", ['False Trigger', event], (err, res) => {
                            if (err) throw (err);
                            if(res.affectedRows > 0) {
                                conn.release();
                                process.exit();
                            }
                        });
                    } 
                });
            } else {
                event = res[0].event;
                process.send(event);
                conn.release();
                process.exit();
            }
        } else {
            process.send(1);
            conn.release();
            process.exit();
        }
    });
});


