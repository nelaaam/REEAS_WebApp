const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((error, conn) => {
        if (error) throw error;

        let countFulfilled = new Promise((resolve, reject) => {
            conn.query('SELECT event FROM Events ORDER BY event DESC LIMIT 1', (err, res) =>{
                if (err) throw err;
                if( res.length == 0 ) {
                        return resolve(1);
                }
                resolve(parseInt(res[0].event)+1);
            });
        });
    
        countFulfilled.then((event) => {     
            values = [event, msg.station, msg.wave, msg.datetime, msg.va, msg.nsa, msg.ewa];
                console.log(values.length);
            conn.query('INSERT INTO Samples (event, station, wave, datetime, va, nsa, ewa) VALUES (?,?,?,?,?,?,?)', values, (err, res) => {
                if (err) throw err;
                console.log(res.insertId);
            });
        });
    
        conn.release();
    });
});

