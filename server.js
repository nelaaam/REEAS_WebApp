const express = require('express');
const detectionRoute = require('./api/routes/detections/detections');
const server = express();

server.use('/route/detections', detectionRoute);

port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
