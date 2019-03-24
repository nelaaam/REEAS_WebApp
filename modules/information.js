const calculator = require('../scripts/calculator');
const opencage = require('opencage-api-client');
process.on('message', (msg) => {
    
    const earthquake_information = {
        latitude: lat,
        longitude: long,
        epicenter: place.formatted,
        event_start: start
    }
    process.send(earthquake_information);
});