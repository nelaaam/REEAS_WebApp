const db = require('../../config/connection');
const child = require('child_process');
const messenger = require('../../scripts/messenger');
var payload;

exports.get_all = (req, res) => {
    db.getConnection((err, conn) => {
        if (err) throw err;
        var query = "SELECT * FROM Events_Record ORDER BY event_id ASC";
        conn.query(query, function (err, res, fields) {
            if (err) throw err;
            payload = { "data": res.body };
            conn.release();
        });
    });
    messenger.sendMessagetoToken(req.params.registrationToken, payload);
}
exports.get_by_year = (req, res) => {
    //NOT YET IMPLEMENTED
}
exports.get_by_magnitude = (req, res) => {
    //NOT YET IMPLEMENTED
}