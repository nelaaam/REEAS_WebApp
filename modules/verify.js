const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        sql1 = 'SELECT COUNT (DISTINCT station) AS pcount FROM Events WHERE wave = 0 AND event = ? ORDER BY datetime ASC; ';
        sql2 = 'SELECT COUNT (DISTINCT station) AS scount FROM Events WHERE wave = 1 AND event = ? ORDER BY datetime ASC';
        sql = sql1 + sql2;
        conn.query(sql, [msg, msg], (err, res) => {
            if (err) throw err;
            p_count = res[0][0].pcount;
            s_count = res[1][0].scount;
            process.send({ p: p_count, s: s_count });
            process.exit();
        });
    });
});

