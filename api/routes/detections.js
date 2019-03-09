const express = require('express');
const Joi = require('joi');
const db = require('../../config/db_config');
const integrate = require('child_process');
const rawCalculator = "calculator_rawdata.js";

const router = express.Router();

router.use(express.json());
var child;
var detections = [];
var sensor_id, longitude, latitude, datetime, xaxis, yaxis, zaxis;

router.post('/', (req, res) => {  
    const { error } = validateDetections(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    res.send("POST Request Successful");
    var xData = req.body.xacc;
    var yData = req.body.yacc;
    var zData = req.body.zacc;
    var dataArr = [xData, yData, zData];
    for (i=0; i<3; i++){
        const detection = {
            data_id: i,
            sensor_id: req.body.id,
            datetime: req.body.datetime,
            data: dataArr[i],
        }
      child = integrate.fork("./modules/calculator_rawdata.js");
      child.send(detection);
    }
    child.on('error', (err) => {
        if (err) throw err;
    });
    child.on('exit', () => {
        console.log("Integration process terminated.");
    });
    child.on('message', (msg) => {
        console.log("Displacement Average is  " + msg);
    });
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

