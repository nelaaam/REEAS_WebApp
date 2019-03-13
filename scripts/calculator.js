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
    const magnitude = 0;

    return magnitude;
}

exports.getEpicenterDistance = function (tp, ts, vs, vp) {
    this.tp = tp;
    this.ts = ts;
    this.vs = vs;
    this.vp = vp;
    return d = ((ts - tp) / ((1 / vs) - 1 / vp));
}

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

exports.getTimeDifference = function(time1, time2) {
    return time2 - time1;
}