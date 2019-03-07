const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/detections', (req, res) => {
    res.send([1,2,3]);
});

app.post('/', (req, res) => {
    res.send('POST request to homepage');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port " + port);
});

