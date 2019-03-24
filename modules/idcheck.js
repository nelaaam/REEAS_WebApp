
db = require('../config/connection');

db.getConnection((err, conn) => {
    if (err) throw err;
    conn.query("SELECT event, datetime FROM Events ORDER BY datetime LIMIT 1", (err, res) => {
        if (err) throw err;
        last = new Date(res[0].datetime);
        now = new Date();
        if ((now - last) >= 120000){
            event = res[0].event + 1;
            process.send(event);
            conn.release();
            process.exit();
        } else {
            event = res[0].event;
            process.send(event);
            conn.release();
            process.exit();
        }
    });
});