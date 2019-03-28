const child = require('child_process');

exports.update_sensor = (req, res) => {
    //VALIDATE DATA
    const { error } = validateDetections(req.body);
    if (error) {
        res.status(400).send("Error: " + error.details[0].message);
        return;
    }
    var sensor_data = {
        station: req.station,
        latitude: req.latitude,
        longitude: req.longitude,
        enabled: req.enabled
    }

    updates = child.fork('../../modules/updateSensor');
    updates.send(sensor_data);
    updates.on('message', (msg) => {
        res.status(200).send(msg);
        console.log(msg);
    });

}
function validateDetections(detected) {
    const schema = {
        station: Joi.string().required(),
        latitude: Joi.number().precision(5),
        longitude: Joi.number().precision(5),
        enabled: Joi.number().required().min(0).max(1),

    }
    return Joi.validate(detected, schema);
}

