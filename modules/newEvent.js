var admin = require("firebase-admin");
var serviceAccount = require("/home/nelamartino/REEASProject/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-alert-c9780.firebaseio.com"
});

const db = require('../config/connection');
const Joi = require('joi');
const mysql = require('mysql');

process.on('message', (msg) => {
  validateMsg(msg);

  var query= "SELECT * FROM IncomingEvent_Record  ORDER BY event_id DESC";
  db.getConnection((err, conn) => {
          if (err) throw err;
          else console.log("Connection variable created.");
          var finalquery = conn.query(query, function(err, res, fields){
              if (err) throw err;
              console.log(res.insertId);
              var topic = "ALERT_NOTIFICATIONS";

              var payload = {
                "message":{
                  "data":{
                    "event_id" : res.event_id,
                    "sensor_id" : res.sensor_id,
                    "latitude" : res.latitude,
                    "longitude" : res.longitude,
                    "magnitude" : res.magnitude
                  }
                }
              };

              admin.messaging().sendToTopic(topic, payload, options)
                  .then(function(response){
                  console.log("Successfully sent message: ", response);
              })
              .catch(function(error){
                 console.log("Error sending message: ", error);
              });
              conn.release();
          });
          console.log(finalquery.sql);
    });

});

function validateMsg(message) {
    const schema = {
        data_id: Joi.number().min(1).max(3).required(),
        sensor_id: Joi.number().required(),
        datetime: Joi.date().timestamp('unix').required(),
        data: Joi.array().length(50).required()
    }
    return Joi.validate(message, schema);
}
