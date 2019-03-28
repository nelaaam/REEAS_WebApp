const db = require('../../config/connection');
const mysql = require('mysql');
var payload;

exports.get_default = (req, response) => {
    if (req.query.start == null) var start = '_';
    else var start = parseInt(req.query.start) / 10 + '_';
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    db.getConnection((err, conn) => {
        if (err) throw err;
        var query = "SELECT * FROM Earthquakes WHERE earthquake = ? ORDER BY ? DESC LIMIT 10";
        values = [start, order];
        conn.query(query, values, function (err, res, fields) {
            if (err) throw err;
            results = JSON.parse(JSON.stringify(res));
            payload = { "data": results };
            console.log(payload);
            response.send(payload);
        });
        conn.release();
    });
}
exports.get_by_year = (req, response) => {
    const year = req.params.year;
    const datetime = year + '%';
    if (req.query.start == null) var start = '_';
    else var start = parseInt(req.query.start) / 10 + '_';
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    db.getConnection((err, conn) => {
        if (err) throw err;
        var query = "SELECT * FROM Earthquakes WHERE datetime LIKE ? AND earthquake LIKE ? ORDER BY ? DESC LIMIT 10";
        values = [datetime, start, order];
        conn.query(query, values, function (err, res, fields) {
            if (err) throw err;
            results = JSON.parse(JSON.stringify(res));
            payload = { "data": results };
            console.log(payload);
            response.send(payload);
        });
        conn.release();
    });
}
exports.get_by_year_magnitude = (req, response) => {
    const year = req.params.year;
    const datetime = year + '%';
    const magnitude = req.params.magnitude + '._';
    if (req.query.start == null) var start = '_';
    else var start = parseInt(req.query.start) / 10 + '_';
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    db.getConnection((err, conn) => {
        if (err) throw err;
        var query = "SELECT * FROM Earthquakes WHERE datetime LIKE ? AND magnitude LIKE ? AND earthquake LIKE ? ORDER BY ? DESC LIMIT 10";
        values = [datetime, magnitude, start, order];
        conn.query(query, values, function (err, res, fields) {
            if (err) throw err;
            results = JSON.parse(JSON.stringify(res));
            payload = { "data": results };
            console.log(payload);
            response.send(payload);
        });
        conn.release();
    });
}




