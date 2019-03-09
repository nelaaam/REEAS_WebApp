const db = require('../config/connection');
const Joi = require('joi');
var vel = [0,0];
var acc = [0,0];
var pos = [0,0];
var ap = [], a2p = [], sum = 0;


process.on('message', (msg) => {
    validateMsg(msg);
    //integrate
    for (i=0; i!=50; i++) {
        acc[1] = msg.data[i];
        vel[1] = vel[0] + acc[0] * 0.02 + ((acc[1] - acc[0]) / 2) * 0.02;
        pos[1] = pos[0] + vel[0] *0.02 + ((vel[1] - vel[0]) / 2) * 0.02;
        ap[i] = vel[1];
        a2p[i] = pos[1];
        acc[0] = acc[1];
        vel[0] = vel[1];
        pos[0]= pos[1];
    }
    //summation of displacement
    for (i=0; i < a2p.length; i++){
        sum = sum + a2p[i];
    }
    //displacement average
    const disAve = sum/a2p.length;
    //data storing
    if(msg.data_id == 1) var table = "XAxis_Records";
    else if(msg.data_id == 1) var table = "YAxis_Records";
    else if(msg.data_id == 2) var table = "ZAxis_Records";


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






