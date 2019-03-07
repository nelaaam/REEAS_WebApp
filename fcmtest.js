var admin = require("firebase-admin");

var serviceAccount = require("/home/nelamartino/REEASProject/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});

var payload = {
    data: {
        "Date": "This is a data message",
	"Time": "24",
	"Latitude": "30.044281",	
	"Longitude": "31.340002",
	"Speed": "42",
	"Epicenter": "Epicenter",
	"Magnitude": "5.00",
	"Intensity": "Weak"
    }
};

var options = {
    priority: "high",
    timeToLive: 60
};

var topic = "ALERT_NOTIFICATIONS";
admin.messaging().sendToTopic(topic, payload, options)
    .then(function(response){
    console.log("Successfully sent message: ", response);
})
.catch(function(error){
   console.log("Error sending message: ", error);
});

