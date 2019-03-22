const db = require('../config/connection');
const calculator = require('../scripts/calculator');

process.on('message', (msg) => {
    
    //data preparation
    const pgd = calculator.getDisplacement(msg.samples);
    const wave = msg.wave;
    const station = msg.station;
    const datetime = new Date(msg.timestamp * 1000);
    
    //prepare query
    const sql = "INSERT INTO Displacements (station, wave, datetime, pgd) VALUES (?,?,?,?)";
    const values = [station, wave, datetime, pgd];

    //connect to database
    db.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, values, (err, res) => {
            if (err) throw err;
            console.log("New PGD recorded at row " + res.insertId);    
        });
        conn.release();
    });
});

