const db = require('../../config/connection');
const child = require('child_process');
const messenger = require('../../scripts/messenger');
var payload;

exports.get_all = (req, response) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var query = "SELECT * FROM Events_Record ORDER BY event_id ASC";
        conn.query(query, function (err, res, fields) {
            if (err) throw err;
		results = JSON.parse(JSON.stringify(res));
            payload = { "data" : results };
		console.log(payload);
		response.send(payload);
        });
conn.release();
    });
}
exports.get_by_year = (req, res) => {
    //NOT YET IMPLEMENTED
}
exports.get_by_magnitude = (req, res) => {
    //NOT YET IMPLEMENTED
}
