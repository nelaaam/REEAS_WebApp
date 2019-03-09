const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');
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
    const sensor_id = msg.sensor_id;
    const timestamp = msg.timestamp_id; 
    //process data storing to db
    
    table = "XAxis_Record";
    if(msg.data_id == 0) table = "XAxis_Record";
    else if(msg.data_id == 1) table = "XAxis_Record"; 
    else if(msg.data_id == 2) table = "XAxis_Record";
    query = "INSERT INTO ? (sensor_id, peak_amplitude, timestamp) VALUES (?,?,?)";
    var inserts = [table, sensor_id, disAve, timestamp];
    var query = mysql.format(query, inserts);
    db.getConnection((err, conn) => {
        conn.query('SELECT something from sometable', (error, results, fields) => {
            if (err) throw err;
            else console.log("Connection variable created.");
            var finalquery = conn.query(query, function(err, res, fields){
                if (err) throw err;
                console.log(res.insertId);
                //conn.release();
            });
            console.log(finalquery.sql);
            db.release();
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