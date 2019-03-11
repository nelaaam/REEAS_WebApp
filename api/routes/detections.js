const express = require('express');
const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
const integrate = require('child_process');

const router = express.Router();

router.use(express.json());
var child;

router.post('/', (req, res) => {  
    const { error } = validateDetections(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    res.send("POST Request Successful");
    const xData = req.body.va;
    const yData = req.body.ns;
    const zData = req.body.ew;

    const dataArr = [xData, yData, zData];
    for (i=0; i<3; i++){
        const detection = {
            data_id: i,
            sensor_id: req.body.sensor_id,
            datetime: req.body.datetime,
            data: dataArr[i],
        }
      child = integrate.fork("./modules/displacement.js");
      child.send(detection);
    }
    child.on('error', (err) => {
        if (err) throw err;
    });
    child.on('exit', () => {
        console.log("Integration process terminated.");
    });
    
    /*
    //P-WAVE PALANG TO:
    db.getConnection((err, conn) => {
        conn.query('SELECT COUNT(DISTINCT sensor_id) FROM ZAxis_Record;', (error, results, fields) => {
            if (err) throw err;
            console.log(results);
            const dataCount = results;
        });
    });
    if(datacount >= 3) {
        //TODO: Calculate magnitude and epicenter
        //SELECT TOP 3 DISTINCT sensor_id FROM ZAxis_Record ORDER BY timestamp ASC
        //SELECT latitude, longitude FROM Sensor_Record WHERE sensor_id = ???
        //FORK calculator_epicenter.js
        //FORK calculator_magnitude.JS
        //FORK notification_data.js
        
    }/* else {
        //TODO: Calculate magnitude only
        //
    }*/
});

function validateDetections(detected) {
    const schema = {
        id: Joi.number().required(),
        long: Joi.number().precision(10),
        lat: Joi.number().precision(10),
        datetime: Joi.date().timestamp('unix').required(),
        xacc: Joi.array().length(50).required(),
        yacc: Joi.array().length(50).required(),
        zacc: Joi.array().length(50).required()
    }    
    return Joi.validate(detected, schema);
}

module.exports = router;