const db = require('../config/connection');
process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT latitude, longitude FROM Stations WHERE station = ?";
        var station = msg.station;
        var datetime = new Date(msg.datetime).toISOString().replace('Z', '');
        var latitude = msg.latitude;
        var longitude = msg.longitude;
        var enabled = msg.enabled;
        conn.query(sql1, station, (err, res) => {
            if (err) throw err; 
            if (res.length < 1) {
                var sql2 = "INSERT INTO Stations (station, datetime, latitude, longitude, enabled) VALUES (?, ?, ?, ?, ?);";
                values = [station, datetime, latitude, longitude, enabled];
                conn.query(sql2, values, (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows > 0) {
                        console.log("SENDING");
                        process.send({ status: 202, message: "Successfully added new station" });
                        conn.release();
                        process.exit();
                    }
                });
            } else {
                if (latitude != null || longitude != null) {
                    if (latitude != null && latitude != res[0].latitude) {
                        latitude = res[0].latitude;
                    }
                    if (longitude != null && longitude != res[0].longitude) {
                        longitude = res[0].longitude;
                    }
                    var sql2 = "UPDATE Stations SET datetime = ? , latitude =? , longitude = ?, enabled = ? WHERE station = ?;";
                    var values = [datetime, latitude, longitude, enabled, station];
                    updateSensor(conn, sql2, values);
                } else {
                    var sql2 = "UPDATE Stations SET datetime = ? , enabled=? WHERE station = ?;";
                    var values = [datetime, enabled, station];
                    updateSensor(conn, sql2, values);
                }
            }
        });
    });
})


function updateSensor(connection, query, values) {
    connection.query(query, values, (err, res) => {
        if (err) throw err;
        if (res.changedRows > 0 || res.affectedRows > 0) {
            process.send({ status: 201, message: "Successfully connected to server." });
            connection.release();
            process.exit();
        } else {
            process.send({ status: 404, message: "Station not found!" });
            connection.release();
            process.exit();
        }
    });
}


