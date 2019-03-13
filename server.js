const express = require('express');
const detectionRoute = require('./api/routes/detections');
const earthquakeRoute = require('./api/routes/earthquakes');
const server = express();

server.use('/detections', detectionRoute);
server.use('/earthquakes', earthquakeRoute);

port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
