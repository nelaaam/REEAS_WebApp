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

    //summation of displacement
    for (i = 0; i < a2p.length; i++) {
        sum = sum + a2p[i];
    }

    //displacement average
    const peak_amplitude = sum / a2p.length;

    return peak_amplitude;
}

exports.getMagnitude = function(peak_amplitude, distance) {
    magnitude = Math.log(peak_amplitude) + (2.56 * Math.log(distance) - 1.67);
    const magnitude = 0;

    return magnitude;
}

exports.getEpicenter = function() {


}