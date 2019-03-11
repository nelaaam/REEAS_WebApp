const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../scripts/calculator');

//
validateMsg(msg);
//prepare query
const sql = "INSERT INTO Displacement_Record (wave_type, sensor_id, peak_x, peak_y, peak_z, timestamp) VALUES (?,?,?,?,?,?)";
const values = [wave_type, sensor_id, xDispacement, yDisplacement, zDisplacement, timestamp];
query = mysql.format(sql, values);

//connect to database
db.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(query, function (err, res, fields) {
        if (err) throw err;
        console.log(res.insertId);
        conn.release();
    });
});