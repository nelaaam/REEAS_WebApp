const express = require('express');
const detectionRoute = require('./api/routes/detections');
const earthquakeRoute = require('./api/routes/earthquakes');
const stationRoute = require('./api/routes/stations');
const server = express();

server.use('/detections', detectionRoute);
server.use('/earthquakes', earthquakeRoute);
server.use('/stations', stationRoute);

port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
