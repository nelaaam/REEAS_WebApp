const db = require('../../config/connection');
const child = require('child_process');

exports.post_new_detection = (req, res) => {

    var integration, epicenter, magnitude, newEvent, clearEvent, recordEvent; //child processes
    var id, lat, long, mag, ts, wt, vAxis, nsAxis, ewAxis; //data variables
    var eventDone = 0; //boolean variables

    //VALIDATE DATA
    const { error } = validateDetections(req.body);
    if (error) {
        res.status(400).send("Error: " + error.details[0].message);
        return;
    }
    res.send("POST Request Successful");

    id = req.body.sensor_id;
    wt = req.body.wave_type;
    ts = new Date(req.body.timestamp*1000);
    vAxis = req.body.va;
    nsAxis = req.body.ns;
    ewAxis = req.body.ew;

    //START DATA FOR ANALYSIS
    const detection = {
        sensor_id: id,
        wave_type: wt,
        timestamp: ts,
        va: vAxis,
        ns: nsAxis,
        ew: ewAxis
    }

    integration = child.fork("./modules/displacement.js");
    integration.send(detection);

    integration.on('error', (err) => {
        if (err) throw err;
    });
    integration.on('exit', () => {
        console.log("Integration process terminated.");
    });


    db.getConnection((err, conn) => {
        if (err) throw err;
        //VALIDATION OF EARTHQUAKE
        conn.query('SELECT COUNT DISTINCT sensor_id FROM Displacement_Record WHERE wave_type = 1 BY timestamp ASC ;', (err, res, fields) => {
            if (err) throw err;
            if (res.length >= 3) { //verified event
                parameters = child.fork("./modules/parameters.js");
                /*
                epicenter.on('message', (latitude, longitude) => {
                    lat = latitude;
                    long = longitude;
                });
                magnitude.on('message', (magnitude) => {
                    mag = magnitude;
                });

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
                    process.on('message', (msg) => {
                        if (msg == 200) {
                            clearEvent = child.fork("./modules/clearEvent.js");     
                        }
                    });
                }*/
            } else { //unverified event try to calculate magnitude and epicenter
                console.log("Triggered sensors less than 3, event not verified! Logging as false trigger.");
                //LOG to falsetriggers.txt
            }
        });
    });
}