const db = require('../../config/connection');

process.on('message', (msg) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT latitude, longitude FROM Sensors WHERE station = ?";
        const station = msg.station;
        var latitude = msg.latitude;
        var longitude = msg.longitude;
        var enabled = msg.enabled;
        conn.query(sql1, station, (err, res) => {
            if (err) {
                throw err;
            }
            if (res[0].latitude != null || res[0].longitude != null) {
                if (latitude != null && latitude != res[0].latitude) {
                    latitude = res[0].latitude;
                }
                if (longitude != null && longitude != res[0].longitude) {
                    longitude = res[0].longitude;
                }
                var sql2 = "UPDATE Sensors SET latitude =? , longitude = ?, enabled = ? WHERE station = ?;";
                var values = [latitude, longitude, enabled, station];
                updateSensor(conn, sql2, values);
                process.send({ status: 202, message: "Successfully updated sensor details." });
                conn.release();
                process.exit();
            } else {
                var sql2 = "UPDATE Sensors SET enabled=? WHERE station = ?;";
                var values = [enabled, station];
                updateSensor(conn, sql2, values);
                process.send({ status: 201, message: "Successfully connected to server." });

                conn.release();
                process.exit();
            }
        });
    });
})


function updateSensor(connection, query, values) {
    connection.query(query, values, (err, res) => {
        if (err) throw err;
        console.log("Sensor Updated: " + res.insertId);
    });
}