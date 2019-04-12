var admin = require("firebase-admin");
var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});

const db = require('../config/connection');

var query = "SELECT * FROM Earthquakes ORDER BY event DESC LIMIT 1";
db.getConnection((err, conn) => {
  if (err) throw err;
  conn.query(query, function (err, res) {
    if (err) throw err;
    var topic = "ALERT_NOTIFICATIONS";

    var b1 = "An earthquake was detected near ";
    var b2 = " with magnitude ";

    var payload = {
      "notification": {
        "title": "A new earthquake was detected",
        "body": b1.concat(res[0].epicenter, b2, res[0].magnitude),
        "click_action": "DASHBOARD"
      }
    };
    var options = {
      timeToLive: 100
    };

    admin.messaging().sendToTopic(topic, payload, options)
      .then(function (response) {
        console.log("Successfully sent message: ", response);
      })
      .catch(function (error) {
        console.log("Error sending message: ", error);
      });
    conn.release();
  });
});

