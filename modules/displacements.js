const db = require('../config/connection');
const calculator = require('../scripts/calculator');

process.on('message', (msg) => {
    const wave = msg.wave;
    const station = msg.station;
    const datetime = msg.datetime;
    var pgd;
    //data preparation
    if(wave == 0) pgd = calculator.getDisplacement(msg.va);
    else pgd = calculator.getDisplacement(msg.nsa);
   
    
    //prepare query
    const sql = "INSERT INTO Displacements (station, wave, datetime, pgd) VALUES (?,?,?,?)";
    const values = [station, wave, datetime, pgd];

    //connect to database
    db.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, values, (err, res) => {
            if (err) throw err;
                if (res.affectedRows > 0) {
                        process.send(res.insertId);
                        conn.release();
                        process.exit();
                }
        });
    });
});

