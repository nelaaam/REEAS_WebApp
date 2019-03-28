const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((error, conn) => {
        if (error) throw error;
        event = JSON.stringify(msg.event);
        va = JSON.stringify(msg.va);
        nsa = JSON.stringify(msg.nsa);
        ewa = JSON.stringify(msg.ewa);
        values = [event, msg.station, msg.wave, msg.datetime, va, nsa, ewa];
        conn.query('INSERT INTO Events (event, station, wave, datetime, va, nsa, ewa) VALUES (?,?,?,?,?,?,?)', values, (err, res) => {
            if (err) throw err;
            if (res.affectedRows > 0) {
                conn.release();
                process.exit();
            }
        });
    });
});





