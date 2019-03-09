const db = require('connection');
const dataArr;
const disAve;
var vel = [0,0];
var acc = [0,0];
var pos = [0,0];
var aPrime, a2Prime, disAve, disSum;


process.on('message', (data) => {

    dataArr = JSON.parse(data);
    
    
    for (i=0; i!=50; i++) {
        acc[1] = dataArr[i];
        vel[1] = vel[0] + acc[0] * 0.02 + ((acc[1] - acc[2]) / 2) * 0.02;
        pos[1] = pos[0] + vel[0] *0.02 + ((vel[1] - vel[0]) / 2) * 0.02;
        aPrime[i] = vel[1];
        a2Prime[i] = pos[1];
        acc[0] = acc[1];
        vel[0] = vel[1];
        pos[0]= pos[1];
    }

    for (i=0; i < a2Prime.length; i++){
        disSum = disSum + a2Prime[i];
    }
    
    disAve = disSum/a2Prime.length;


});
