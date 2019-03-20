const math = require('mathjs');
exports.getDisplacement = function (data) {
    //initialize
    var vel = [0, 0];
    var acc = [0, 0];
    var pos = [0, 0];
    var ap = [], a2p = [], sum = 0;

    //integrate
    for (i = 0; i < data.length; i++) {
        acc[1] = data[i];
        vel[1] = vel[0] + acc[0] * 0.025 + ((acc[1] - acc[0]) / 2) * 0.025;
        pos[1] = pos[0] + vel[0] * 0.025 + ((vel[1] - vel[0]) / 2) * 0.025;
        ap[i] = vel[1];
        a2p[i] = pos[1];
        acc[0] = acc[1];
        vel[0] = vel[1];
        pos[0] = pos[1];
    }
    for (var i = 0; i < a2p.length; i++) {
        sum = sum + a2p[i];
    }
    //displacement average
    const peak_amplitude = Math.max(...a2p) / 1000;

    return peak_amplitude;
}
exports.integrateVelocity = function (data) {
    //initialize
    var vel = [0, 0];
    var pos = [0, 0];
    var ap = [], a2p = [], sum = 0;

    //integrate
    for (i = 0; i < data.length; i++) {
        vel[1] = data[i];
        pos[1] = pos[0] + vel[0] * 0.025 + ((vel[1] - vel[0]) / 2) * 0.025;
        a2p[i] = pos[1];
        vel[0] = vel[1];
        pos[0] = pos[1];
    }
    //displacement average
    const peak_amplitude = Math.max(...a2p) / 1000;
    return peak_amplitude;
}

exports.getMagnitude = function (peak_amplitude, distance) {
    magnitude = Math.log10(peak_amplitude) + 2.56 * Math.log10(distance) - 1.67;
    return magnitude;
}

//radius of sensor stations
exports.getEpicenterDistance = function (tp, ts, vs, vp) {
	console.log((ts-tp)/1000);
    d = Math.abs(((ts - tp)/1000) / ((1/4)-(1/6)));
	console.log("Epicenter Distance = " + d);
return d;
}

//estimated velocity of p-wave
exports.getEstimatedVelocity = function (d, t) {
    return d / t;
}


exports.getCoordinateDistance = function (loc1, loc2) {
    const lat1 = loc1[0];
    const lon1 = loc1[1];
    const lat2 = loc2[0];
    const lon2 = loc2[1];
    const R = 6371; // metres
    const l1 = Math.radians(lat1);
    const l2 = Math.radians(lat2);
    const latDiff = Math.radians(lat2 - lat1);
    const lonDiff = Math.radians(lon2 - lon1);
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(l1) * Math.cos(l2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return d = R * c;
}

//pwave and swave time of arrival
exports.getTimeDifference = function (time1, time2) {
    return (time2 - time1)/1000;
}

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
}


