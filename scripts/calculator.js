exports.getDisplacement = function (data) {

    //initialize
    var vel = [0, 0];
    var acc = [0, 0];
    var pos = [0, 0];
    var ap = [], a2p = [], sum = 0;

    //integrate
    for (i = 0; i != 50; i++) {
        acc[1] = data[i];
        vel[1] = vel[0] + acc[0] * 0.02 + ((acc[1] - acc[0]) / 2) * 0.02;
        pos[1] = pos[0] + vel[0] * 0.02 + ((vel[1] - vel[0]) / 2) * 0.02;
        ap[i] = vel[1];
        a2p[i] = pos[1];
        acc[0] = acc[1];
        vel[0] = vel[1];
        pos[0] = pos[1];
    }
    const sum = a2p => a2p.reduce((a,b) => a + b, 0)
    //displacement average
    const peak_amplitude = sum / a2p.length;

    return peak_amplitude * 1000;
}

exports.getMagnitude = function (peak_amplitude, distance) {
    magnitude = Math.log(peak_amplitude) + (2.56 * Math.log(distance) - 1.67);
    return magnitude;
}

//radius of sensor stations
exports.getEpicenterDistance = function (tp, ts, vs, vp) {
    this.tp = tp;
    this.ts = ts;
    this.vs = vs;
    this.vp = vp;
    return d = (ts - tp) / ((1 / vs) - (1 / vp));
}

//estimated velocity of p-wave
exports.getEstimatedVelocity = function (d, t) {
    return d / t;
}

exports.getCoordinateDistance = function (lat1, lat2, lon1, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1.toRadians();
    const φ2 = lat2.toRadians();
    const Δφ = (lat2 - lat1).toRadians();
    const Δλ = (lon2 - lon1).toRadians();

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return d = R * c
}

//pwave and swave time of arrival
exports.getTimeDifference = function(time1, time2) {
    return time2 - time1;
}

exports.getEpicenter = function(p1, p2, p3, d1, d2, d3) {
var x1 = p1[0];
var x2 = p1[1];
var x3 = p2[0];
var y1 = p2[1];
var y2 = p3[0];
var y3 = p3[1];
var r1 = d1;
var r2 = d2;
var r3 = d3;

var A = (-2 * x1) + (2 * x2);
var B = (-2 * y1) + (2 * y2);
var C = Math.pow(r1, 2) - Math.pow(r2, 2) - Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(y1, 2) + Math.pow(y2, 2);
var D = (-2 * x2) + (2 * x3);
var E = (-2 * y2) + (2 * y3);
var F = Math.pow(r2, 2) - Math.pow(r3, 2) - Math.pow(x2, 2) + Math.pow(x3, 2) + Math.pow(y2, 2) + Math.pow(y3, 2);

var x = (C * E - F * B) / (E * A - B * D);
var y = (C * D - A * F) / (B * D - A * E);

var epicenter = [x,y];
retrurn epicenter;
}