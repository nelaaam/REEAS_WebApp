
const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((error, conn) => {
        if (error) throw error;
        let countFulfilled = new Promise((resolve, reject) => {
            conn.query('SELECT event FROM Events ORDER BY event DESC LIMIT 1', (err, res) =>{
                if (err) throw err;
                if(res.length == 0) {

                        return resolve(1);
                }
                resolve(res[0].event + 1);
            });
        });
    
        countFulfilled.then((event) => {     
            va = JSON.stringify(msg.va);
            nsa = JSON.stringify(msg.nsa);
            ewa = JSON.stringify(msg.ewa);
            values = [event, msg.station, msg.wave, msg.datetime, va, nsa, ewa];
            conn.query('INSERT INTO Samples (event, station, wave, datetime, va, nsa, ewa) VALUES (?,?,?,?,?,?,?)', values, (err, res) => {
                if (err) throw err;
                if (res.affectedRows > 0) {
                    process.send(res.insertId);
                    conn.release();
                    process.exit();
            }
            });
        });
    });
});



