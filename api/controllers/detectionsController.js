const Joi = require('joi');
const child = require('child_process');
const module_getID = "./modules/getID";
const module_saveEvent = "./modules/saveEvent";
const module_getPGD = "./modules/getPGD";
const module_getInformation = "./modules/getInformation";
const module_getCount = "./modules/getCount";
const module_sendNotification = "./modules/sendNotification";
const module_updateStatus = "./modules/updateStatus";
const module_sendAlert = "./modules/sendAlert";
const module_getVelocity = "./modules/getAcceleration";
var va_acc = [], nsa_acc = [], ewa_acc = [];
exports.post_new_detection = (req, res) => {
    //VALIDATE DATA
    const { error } = validateDetections(req.body);
    if (error) {
        res.status(400).send("Error: " + error.details[0].message);
        return;
    } else {
        res.status(200).send({ "status": 200, "message": "Successful" });
        let id = child.fork(module_getID);
        id.send({ datetime: req.body.timestamp });
        id.on('message', (eventID) => {
            if (req.body.test == true) {
                console.log("HELLO");
                va_acc = req.body.va;
                nsa_acc = req.body.nsa;
                ewa_acc = req.body.ewa;
                startProcess(eventID, req.body);

            } else {
                console.log("Hi");
                let acceleration = child.fork(module_getVelocity);
                acceleration.send([req.body.va, req.body.nsa, req.body.ewa]);
                acceleration.on('message', (data) => {
                    va_acc = data[0];
                    nsa_acc = data[1];
                    ewa_acc = data[2];
                    startProcess(eventID, req.body);
                });
            }
        });
    }
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

function startProcess(eventID, data) {
    console.log("data = " + data);
    const event_id = eventID;
    const detection = {
        event: event_id,
        station: data.station,
        wave: data.wave,
        datetime: new Date(data.timestamp * 1000).toISOString().replace('Z', ''),
        va: va_acc,
        nsa: nsa_acc,
        ewa: ewa_acc
    }
    //SAVE SAMPLES TO DB USING EVENT ID
    let event = child.fork(module_saveEvent);
    event.send(detection);
    event.on('error', (err) => {
        if (err) throw err;
    });
    event.on('exit', () => {
        //CALCULATE AND SAVE PGD TO DB
        let pgd = child.fork(module_getPGD);
        pgd.send(detection);
        pgd.on('exit', () => {
            //VERIFY EVENTS THROUGH OTHER DATA
            let verify = child.fork(module_getCount);
            verify.send(detection.event);
            verify.on('message', (count) => {
                if (count.p >= 3 && count.s >= 3) {
                    let status = child.fork(module_updateStatus);
                    status.send({ event: event_id, status: "Earthquake" });
                    status.on("message", (eventStatus) => {
                        if (eventStatus.data == "Send Notification") {
                            let notification = child.fork(module_sendNotification);
                            notification.on('exit', () => {
                                console.log('Notification sent.')
                            });
                        }
                    });
                    //EVENT IS VERIFIED START CALCULATIONS
                    let information = child.fork(module_getInformation);
                    information.send(detection.event);
                    information.on("message", (eartquakeInformation) => {
                        let alert = child.fork(module_sendAlert);
                        alert.send(eartquakeInformation);
                    });
                } else {
                    let status = child.fork(module_updateStatus);
                    status.send({ event: event_id, status: "Not Yet Verified" });
                    status.on("message", (eventStatus) => {
                        if (eventStatus == "False Trigger") {
                            console.log("Event " + eventStatus.event_id + eventStatus.data);
                        }
                    });
                }
            })
        });
        pgd.on('error', (err) => {
            if (err) throw err;
        });
    });
}