const express = require('express');
const detectionRoute = require('./api/routes/detections');
const server = express();

server.use('/detections', detectionRoute);

port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
