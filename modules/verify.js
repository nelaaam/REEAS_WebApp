const db = require('../../config/connection');

process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        sql1 = 'SELECT COUNT event AS p_count FROM Displacements WHERE wave = 1 AND event = ? ORDER BY datetime ASC; ';
        sql2 = 'SELECT COUNT event AS s_count FROM Displacements WHERE wave = 0 AND event = ? ORDER BY datetime ASC';
        sql = sql1 + sql2;
        conn.query(sql, [msg.event, msg.event], (err, res) => {
            if (err) throw err;
            p_count = res[0][0].p_count;
            s_count = res[1][0].s_count;
            if (res.affectedRows > 0) {
                process.send({ p: p_count, s: s_count });
                process.exit();
            } else {
                process.send({ p: 0, s: 0 });
                process.exit();
            }
        });
    });
});
