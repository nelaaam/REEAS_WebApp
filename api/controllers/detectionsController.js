const Joi = require('joi');
const db = require('../../config/connection');
const child = require('child_process');
exports.post_new_detection = (req, res) => {
    var detections, samples, parameters, newEvent, clearEvent, recordEvent; //child processes
    var id, ts, wt, vAxis, nsAxis, ewAxis; //data variables
    var eventDone = 0; //boolean variables
    //VALIDATE DATA
    const { error } = validateDetections(req.body);
    if (error) {
        res.status(400).send("Error: " + error.details[0].message);
        return;
    }
    res.send("POST Request Successful");
    id = req.body.station;
    wt = req.body.wave;
    ts = new Date(req.body.timestamp * 1000);
    date = ts.toISOString().replace('Z', '');
    vAxis = req.body.va;
    nsAxis = req.body.nsa;
    ewAxis = req.body.ewa;
    //START DATA FOR ANALYSIS
    const detection = {
        station: id,
        wave: wt,
        datetime: date,
        va: vAxis,
        nsa: nsAxis,
        ewa: ewAxis
    }
    samples = child.fork("./modules/samples.js");
    samples.send(detection);
    samples.on('message', (msg) => {
        console.log("New samples recorded into row " + msg);
    });
    samples.on('exit', () => {
        console.log("Samples Process Exited");
    });
    detections = child.fork("./modules/displacement.js");
    detections.send(detection);
    detections.on('error', (err) => {
        if (err) throw err;
    });
    detections.on('exit', () => {
        console.log("Displacement Process Exited");
    });

    detections.on('message', (msg) => {
        console.log("NEW PGD recorded into row " + msg);
        db.getConnection((err, conn) => {
            if (err) throw err;
            //VALIDATION OF EARTHQUAKE
            conn.query('SELECT COUNT (DISTINCT station) AS count FROM Displacements WHERE wave = 1 ORDER BY datetime ASC; SELECT COUNT (DISTINCT station) AS count FROM Displacements WHEre wave = 0 ORDER BY datetime ASC', (err, res) => {
                if (err) throw err;
            if (res[0][0].count >= 3 && res[0][1].count >= 3) {
                console.log("New Event Verified! Starting Calculations.");

                //verified event

                parameters = child.fork("./modules/parameters.js");
                parameters.on("message", (message) => {
                    console.log(message);
                })
                /*
                
                //SEND EVENT ALERT/UPDATE
                const new_event = {
                    sensor_id: id,
                    latitude: lat,
                    longitude: long,
                    magnitude: mag,
                    timestamp: ts
                }
 
                newEvent = child.fork("./modules/newEvent.js");
                newEvent.send(new_event);
 
                //CHECK IF EVENT IS DONE, RECORD AND CLEAR IF DONE
                if (eventDone == 1) {
                    recordEvent = child.fork("./modules/clearEvent.js");
                                                }
                    });
                }*/
            } else {
                if (res[0].count >= 3 && res[1].count < 3) {
                }
                //unverified event try to calculate magnitude and epicenter
                console.log("Triggered sensors less than 3, event not verified! Logging as false trigger.");
                //LOG to falsetriggers.txt
            }
        });
    });
});
    
}
function validateDetections(detected) {
    const schema = {
        wave: Joi.number().required().min(0).max(1),
        station: Joi.string().required(),
        timestamp: Joi.date().timestamp('unix').required(),
        va: Joi.array().length(50).required(),
        nsa: Joi.array().length(50).required(),
        ewa: Joi.array().length(50).required()
    }
    return Joi.validate(detected, schema);
}
