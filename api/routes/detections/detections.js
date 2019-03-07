const express = require('express');
const Joi = require('joi');
const router = express.Router();

router.use(express.json());

var detections = [];

router.post('/', (req, res) => {  
    const { error } = validateDetections(req.body); 
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const detection = {
        id: detections.length+1,
        long: req.body.long,
        lat: req.body.lat,
        datetime: req.body.datetime,
        xacc: req.body.xacc,
        yacc: req.body.yacc,
        zacc: req.body.zacc
    }
    detections.push(detection);
    res.status(200).send(detections);
});

function validateDetections(detected) {
    const schema = {
        id: detections.length + 1,
        long: Joi.number().precision(10).required().invalid(null),
        lat: Joi.number().precision(10).required().invalid(null),
        datetime: Joi.date().timestamp('unix').required().invalid(null),
        xacc: Joi.array().length(50).required().invalid(null),
        yacc: Joi.array().length(50).required().invalid(null),
        zacc: Joi.array().length(50).required().invalid(null)
    }    
    return Joi.validate(detected, schema);
}

module.exports = router;

