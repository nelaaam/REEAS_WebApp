var admin = require("firebase-admin");
var serviceAccount = require("/home/nelamartino/REEASProject/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});
const topic = "ALERT_NOTIFICATIONS";
process.on('message', (message) => {
    var payload = {
        "message": {
            "data": {
               "latitude": message.latitude,
               "longitude": message.longitude,
               "epicenter": message.epicenter,
               "event_start": message.event_start
            }
        }
    };
    
    admin.messaging().sendToTopic(topic, payload, options)
        .then(function (response) {
            console.log("Successfully sent message: ", response);
        })
        .catch(function (error) {
            console.log("Error sending message: ", error);
        });

});
