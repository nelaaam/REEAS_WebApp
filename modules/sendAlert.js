var admin = require("firebase-admin");
const db = require('../config/connection');
var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});
const topic = "ALERT";
process.on('message', (msg) => {
    var values = [msg.event, msg.datetime, msg.magnitude, msg.latitude, msg.longitude, msg.location];
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO Alerts (event, datetime, magnitude, latitude, longitude, location) VALUES (?,?,?,?,?,?)', values, (err, res) => {
            if (err) throw err;
            conn.query('SELECT magnitude FROM Alerts WHERE event = ?', msg.event, (err, res) => {
                if (err) throw err;
                var magnitudes = [];
                for(var i = 0; i < res.length; i++) {
                    magnitudes[i] = res[i].magnitude;
                }
                var peak_magnitude = Math.max(...magnitudes);
		        const earthquake_information = {
                    event: JSON.stringify(msg.event),
                    datetime: JSON.stringify(msg.datetime),
                    latitude: JSON.stringify(msg.latitude),
                    longitude: JSON.stringify(msg.longitude),
                    magnitude: JSON.stringify(peak_magnitude),
                    location: JSON.stringify(msg.location)
                };
                var payload = {
                    "data": earthquake_information
                };
		var options = {
		    priority: "high",
		    timeToLive: 5,
		    collapseKey: "alert"
		};
                admin.messaging().sendToTopic(topic, payload, options)
                    .then(function (response) {
                        console.log("Successfully sent message: ", response);
                    })
                    .catch(function (error) {
                        console.log("Error sending message: ", error);
                    });
            }); 
        });
    });
});

