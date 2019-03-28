const express = require('express');
const detectionRoute = require('./api/routes/detections');
const earthquakeRoute = require('./api/routes/earthquakes');
const sensorRoute = require('./api/routes/stations');
const server = express();

server.use('/detections', detectionRoute);
server.use('/earthquakes', earthquakeRoute);
server.use('/stations', sensorRoute);

port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
