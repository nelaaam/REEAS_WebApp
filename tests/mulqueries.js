const db = require('../config/connection');

db.getConnection((error, connection) => {
    if (error) throw error;
    sql = 'SELECT sensor_id FROM Displacement_Record';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        var sensor_id = res[0].sensor_id;
        console.log(sensor_id);
    });
    connection.release();
});