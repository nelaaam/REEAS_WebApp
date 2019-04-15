const acceleration = require('../scripts/calculator').getAccelerationFromG;
const velocity = require('../scripts/calculator').getVelocityFromAcceleration;

process.on('message', (data) => {
    let va_acc = acceleration(data[0]);
    let nsa_acc = acceleration(data[1]);
    let ewa_acc = acceleration(data[2]);
    let va_vel = velocity(va_acc);
    let nsa_vel = velocity(nsa_acc);
    let ewa_vel = velocity(ewa_acc);
    process.send([va_vel, nsa_vel, ewa_vel]);
    process.exit();
});