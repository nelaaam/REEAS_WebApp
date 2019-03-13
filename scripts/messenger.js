const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

const topic = "ALERT_NOTIFICATIONS";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});

const alertOptions = {
    priority: "high",
    timeToLive: 0
};
const notifOptions = {
    priority: "normal"
};
exports.sendMessageToTopic = function(payload, messageID) {
    var options = checkMessageID(messageID);
    admin.messaging().sendToTopic(topic, payload, options)
      .then(function (response) {
        console.log("Successfully sent message: ", response);
      })
      .catch(function (error) {
        console.log("Error sending message: ", error);
      });
  }
  
  exports.sendMessageToToken = function (payload) {
      console.log(payload);
      admin.messaging().sendToTopic(topic, payload, notifOptions)
      .then(function (response) {
        console.log("Successfully sent message: ", response);
      })
      .catch(function (error) {
        console.log("Error sending message: ", error);
      });
  }

  function checkMessageID(mID) {
      if (mID == 1) {
          return alertOptions;
      } if (mID == 2) {
          return notifOptions;
      }
  }
