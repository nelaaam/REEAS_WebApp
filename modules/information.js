const calculator = require('../scripts/calculator');

process.on('message', (msg) => {
    let station = msg.stations;
    let ats = msg.ats;
    let pgd = msg.pgds;

    var at = [], distance = [], ML = [];

    //PGA
    const PGD = Math.max(...pgd);
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            ats[i][j] = getTimeFrTimestamp(raw_timestamp[i][j]);
        }
    }
    //GET S-P
    for (var i = 0; i < 3; i++) {
        at[i] = calculator.getDiffInSeconds(ATs[i][1], ATs[i][0]);
        distance[i] = calculator.getSensorDistance(AT[i]);
        ML[i] = calculator.getMagnitude(PGD, distance[i]);
    }

    let epicenter = calculator.trilaterate(station[0], station[1], station[2], distance);

    function getTimeFrTimestamp(timestamp) {
        date = new Date(timestamp);
        time = date.getTime();
        return time;
    }

    console.log("PGDs = " + PGDs);
    console.log("PGD = " + PGD);
    console.log("ATs = " + ATs);
    console.log("Station Distances = " + distance);
    console.log("MLs = " + ML);
    console.log("Epicenter = " + epicenter);

    process.send([epicenter, ML]);

});