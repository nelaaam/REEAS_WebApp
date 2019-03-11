const Joi = require('joi');
function validateDetections(detected) {
    const schema = {
        wave_type: Joi.number().required().min(0).max(1),
        sensor_id: Joi.number().required(),
        timestamp: Joi.date().timestamp('unix').required(),
        va: Joi.array().length(50).required(),
        ns: Joi.array().length(50).required(),
        ew: Joi.array().length(50).required()
    }
    return Joi.validate(detected, schema);
}


