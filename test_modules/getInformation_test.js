const calculator = require('../scripts/calculator');
const opencage = require('opencage-api-client');

process.on('message', (promise) => {
    var event_start = null;
    let p_at = promise[0];
    let s_at = promise[1];
    for (i = 0; i < promise[0].length; i++) {
        p_at[i] = getTimeFrTimestamp(promise[0][i]);
        s_at[i] = getTimeFrTimestamp(promise[1][i]);
    }
console.log(p_at, s_at);
    let pgd = promise[2];
    var station = [[], []], at = [[], []];
    for (i = 0; i <= 2; i++) {
        station[i] = [promise[3][i], promise[4][i]];
        at[i] = [p_at[i], s_at[i]];
    }
    var AT = [], distance = [], MLs = [], ATs = [[], [], []];
    //PGA
    const PGD = Math.max(...pgd);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            ATs[i][j] = at[i][j];
        }
    }
    //GET S-P
    for (var i = 0; i < 3; i++) {
        AT[i] = calculator.getDiffInSeconds(at[i][1], at[i][0]);
        distance[i] = calculator.getSensorDistance(AT[i]);
        distance[i + 3] = calculator.getSensorDistance(AT[i]);
        if (distance[i] < 600) {
            MLs[i] = calculator.getMagnitude(Math.abs(pgd[i]), distance[i]);
	    MLs[i+3] = calculator.getMagnitude(Math.abs(pgd[i+3]), distance[i+3]);
        } else {
            MLs[i] = 0;
	    MLs[i+3] = 0;
        }
    }
    //Get Peak Magnitude
    let ML = Math.max(...MLs);
    //GET Event Start (if not available)
    if (event_start == null) {
        let minDistance = Math.min(...distance);
        let earliestTime = Math.min(...p_at);
	console.log(earliestTime, minDistance);
        event_start = calculator.getEventStart(earliestTime, minDistance).toISOString().replace('Z', '');
    }
    console.log("PGD = " + pgd);
    console.log("ATs = " + AT);
    console.log("Station Distances = " + distance);
    console.log("MLs = " + MLs);
    //Get Epicenter Coordinates
    let epicenter = calculator.trilaterate(station[0], station[1], station[2], distance);
    //GET LOCATION
    opencage.geocode({ q: epicenter[0].toString() + ", " + epicenter[1].toString(), language: 'en' }).then(data => {

        if (data.status.code == 200) {

            if (data.results.length > 0) {
                var place = data.results[0].formatted;
            } else {
                console.log(data);
                console.log("Can't find location");
            }
            const earthquake_information = {
                datetime: event_start,
                latitude: epicenter[0],
                longitude: epicenter[1],
                magnitude: ML,
                location: place,
            }

            process.send(earthquake_information);
        } else {
            console.log('error', data.status.message);
        }
    }).catch(error => {
        console.log('error', error.message);
    });
});

function getTimeFrTimestamp(timestamp) {
    date = new Date(timestamp);
    time = date.getTime();
    return time;
}
