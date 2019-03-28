const Joi = require('joi');
const child = require('child_process');

exports.post_new_detection = (req, res) => {
    //VALIDATE DATA
    const { error } = validateDetections(req.body);
    if (error) {
        res.status(400).send("Error: " + error.details[0].message);
        return;
    }

    let idcheck = child.fork("./modules/idcheck.js");
    idcheck.on('message', (msg) => {
        //PREPARE DATA FOR ANALYSIS
        const event_id = msg;
        console.log(event_id);
        const detection = {
            event: event_id,
            station: req.body.station,
            wave: req.body.wave,
            datetime: new Date(req.body.timestamp * 1000).toISOString().replace('Z', ''),
            va: req.body.va,
            nsa: req.body.nsa,
            ewa: req.body.ewa
        }

        //SAVE SAMPLES TO DB USING EVENT ID
        let triggers = child.fork("./modules/triggers.js");
        triggers.send(detection);
        triggers.on('error', (err) => {
            if (err) throw err;
        });
        triggers.on('exit', () => {
            console.log("Samples Process Exited");
            //CALCULATE AND SAVE PGD TO DB
            let displacements = child.fork("./modules/displacements.js");
            displacements.send(detection);
            displacements.on('exit', () => {
                console.log(event_id);
                //CHECK IF DATA >=3
                let verify = child.fork("./modules/verify");
                verify.send(detection.event);
                verify.on('message', (msg) => {
                    if (msg.p >= 3 && msg.s >= 3) {
                        res.status(201).send("New trigger recorded, event was verified!");
                        updateEvent = child.fork('../../modules/updateEvent');
                        updateEvent.send({event: event_id, status: "Earthquake"});
                        //EVENT IS VERIFIED START PARAMETER CALCULATIONS
                        parameters = child.fork("./modules/parameters.js");
                        parameters.send(detection.event);
                        parameters.on("message", (msg) => {
                            console.log(msg);
                            var response = {
                                status: 200,
                                message: "This detection was verified as an earthquake.",
                                data: msg
                            }
                            res.status(200).send(response);

                            alerts = child.fork("./modules/alerts.js");
                            alerts.send(msg);
                            
                        });
                    } else {
                        var response = {
                            status: 200,
                            message: "This detection is not yet verified",
                        }
                        res.status(200).send(response);
                    }
                })
            });
            displacements.on('error', (err) => {
                if (err) throw err;
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