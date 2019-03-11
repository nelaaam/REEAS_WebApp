const express = require('express');
const detectionRoute = require('./api/routes/earthquakes');
const server = express();

server.use('/earthquakes', earthquakeRoute);

port = process.env.PORT || 3002;
server.listen(port, () => {
    console.log("Listening on port " + port);
});
