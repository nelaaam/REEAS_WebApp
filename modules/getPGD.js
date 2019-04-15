const db = require('../config/connection');
const calculator = require('../scripts/calculator');

process.on('message', (msg) => {
    const event = msg.event;
    const wave = msg.wave;
    const station = msg.station;
    const datetime = msg.datetime;
    var pgd;
    //data preparation
    if(wave == 0) pgd = calculator.getDisplacementFromVelocity(msg.va);
    else if(wave == 1) pgd = calculator.getDisplacementFromVelocity(msg.nsa);
   
    //prepare query
    const sql = "INSERT INTO Displacements (event, station, wave, datetime, pgd) VALUES (?,?,?,?,?)";
    const values = [event, station, wave, datetime, pgd];

    //connect to database
    db.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, values, (err, res) => {
            if (err) throw err;
                if (res.affectedRows > 0) {
                        conn.release();
                        process.exit();
                }
        });
    });
});

