const db = require('../../config/connection');

process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT status FROM Events WHERE event = ?;";
        values = msg.event;
        conn.query(sql1, values, (err, res) => {
            if (err) throw err;
            if (res[0].status == null) {
                var sql2 = "UPDATE Events SET status = ? WHERE event = ?;";
                var values = [msg.status, msg.event];
                conn.query(sql2, values, (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows > 0) {
                        conn.release();
                        process.exit();
                    }
                });
            } else {
                process.exit();
            }
        });

    });
})
