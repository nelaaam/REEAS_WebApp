const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const calculator = require('../api/controllers/calculator');

process.on('message', (msg) => {
    //validating data
    validateMsg(msg);
    //displacement calculation
    const peak_amplitude = calculator.getDisplacement(msg.data);
    //other data
    const sensor_id = msg.sensor_id;
    const timestamp = new Date(msg.timestamp * 1000);

    //prepare query
    var table;

    if (msg.data_id == 0) table = 'XAxis_Record';
    else if (msg.data_id == 1) table = 'YAxis_Record';
    else if (msg.data_id == 2) table = 'ZAxis_Record';
    const sql = "INSERT INTO ?? (sensor_id, peak_amplitude, timestamp) VALUES (?,?,?)";
    const values = [table, sensor_id, peak_amplitude, timestamp];
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
        data_id: Joi.number().min(1).max(3).required(),
        sensor_id: Joi.number().required(),
        datetime: Joi.date().timestamp('unix').required(),
        data: Joi.array().length(50).required()
    }
    return Joi.validate(message, schema);
}