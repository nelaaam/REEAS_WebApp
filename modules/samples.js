const db = require('../config/connection');

process.on('message', (msg) => {
    db.getConnection((error, conn) => {
        if (error) throw error;
        console.log(msg);
        let countFulfilled = new Promise((resolve, reject) => {
            conn.query('SELECT TOP 1 event FROM Events ORDER BY event DESC', (err, res) =>{
                if (err) throw err;
                resolve(parseInt(res[0].event)+1);
            });
        });
    
        countFulfilled.then((event) => {     
            values = [event, msg.station, msg.wave, msg.datetime, msg.va, msg.nsa, msg.ewa];
            conn.query('INSERT INTO Samples event, station, wave, datetime, va, nsa, ewa VALUES ?,?,?,?,?,?,?', values, (err, res) => {
                if (err) throw err;
                console.log("Samples successfully record at row: " + res.insertId);
            });
        });
    
        connection.release();
    });
});
