exports.getDisplacement = function (data) {
    //initialize
    var vel = [0, 0];
    var acc = [0, 0];
    var pos = [0, 0];
    var ap = [], a2p = [], sum = 0;

    //integrate
    for (i = 0; i < data.length; i++) {
        acc[1] = data[i];
        vel[1] = vel[0] + acc[0] * 0.02 + ((acc[1] - acc[0]) / 2) * 0.02;
        pos[1] = pos[0] + vel[0] * 0.02 + ((vel[1] - vel[0]) / 2) * 0.02;
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

exports.getCoordinateDistance = function (loc1, loc2) {
	const lat1 = loc1[0];
	const lon1 = loc1[1];
	const lat2 = loc2[0];
	const lon2 = loc2[1];
const R = 6371e3; // metres
    const l1 = Math.radians(lat1);
    const l2 = Math.radians(lat2);
    const ln1 = Math.radians(lon1);
    const ln2 = Math.radians(lon2);
const ltDiff = l1-l2;
console.log("Diff " + ltDiff);
    const latDiff = Math.radians(ltDiff);
    const lonDiff = Math.radians(lon2 - lon1);
	console.log("l1 =" + latDiff);
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(l1) * Math.cos(l2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
	console.log("a  = " + a);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return d = R * c}

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
return epicenter;
}

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
}
