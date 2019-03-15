const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../scripts/calculator');

process.on('message', (msg) => {
    //validating data
    validateMsg(msg);
    //displacement calculation
    const xDispacement = calculator.getDisplacement(msg.va);
    const yDisplacement = calculator.getDisplacement(msg.ns);
    const zDisplacement = calculator.getDisplacement(msg.ew);
    //other data
    const wave_type = msg.wave_type;
    const sensor_id = msg.sensor_id;
    const timestamp = new Date(msg.timestamp * 1000);

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
});

function validateMsg(message) {
    const schema = {
        sensor_id: Joi.number().required(),
        wave_type: Joi.number().required().min(0).max(1),
        timestamp: Joi.date().timestamp('unix').required(),
        va: Joi.array().length(50).required(),
        ns: Joi.array().length(50).required(),
        ew: Joi.array().length(50).required()
    }
    return Joi.validate(message, schema);
}
