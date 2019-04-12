const db = require('../../config/connection');
var payload;

var sql1 = "SELECT * FROM Earthquakes WHERE earthquake ORDER BY ? DESC LIMIT 10 OFFSET ?;";
var sql2 = "SELECT * FROM Earthquakes WHERE datetime LIKE ? ORDER BY ? DESC LIMIT 10 OFFSET ?";
var sql3 = "SELECT * FROM Earthquakes WHERE datetime LIKE ? AND magnitude LIKE ? ORDER BY ? DESC LIMIT 10 OFFSET ?";

exports.get_default = (req, response) => {
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    if (req.query.start == null) var start = 0; 
    else var start = parseInt(req.query.start);
    db.getConnection((err, conn) => {
        if (err) throw err;
        values = [order, start];
        conn.query(sql1, values, function (err, res) {
            if (err) throw err;
            if (res.length < 10) var status = "end";
            else var status = "ok"
            if (res.length > 0){
                results = JSON.parse(JSON.stringify(res));
                payload = { "status": status, "data": results };
                console.log(payload);
            } else {
                payload = { "status": status };
            }
            response.send(payload);
        });
        conn.release();
    });
}
exports.get_by_year = (req, response) => {
    const year = req.params.year;
    const datetime = year + '%';
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    if (req.query.start == null) var start = 0; 
    else var start = parseInt(req.query.start);
    db.getConnection((err, conn) => {
        if (err) throw err;
        values = [datetime, order, start];
        conn.query(sql2, values, function (err, res) {
            if (err) throw err;
            if (res.length < 10) var status = "end";
            else var status = "ok"
            if (res.length > 0){
                results = JSON.parse(JSON.stringify(res));
                payload = { "status": status, "data": results };
                console.log(payload);
            } else {
                payload = { "status": status };
            }
            response.send(payload);
        });
        conn.release();
    });
}
exports.get_by_year_magnitude = (req, response) => {
    const year = req.params.year;
    const datetime = year + '%';
    const magnitude = req.params.magnitude + '.%';
    if (req.query.orderBy == null) var order = 'datetime';
    else var order = req.query.orderBy;
    if (req.query.start == null) var start = 0; 
    else var start = parseInt(req.query.start);
    values = [datetime, magnitude, order, start];
    db.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql3, values, function (err, res) {
            if (err) throw err;
            if (res.length < 10) var status = "end";
            else var status = "ok"
            if (res.length > 0){
                results = JSON.parse(JSON.stringify(res));
                payload = { "status": status, "data": results };
                console.log(payload);
            } else {
                payload = { "status": status };
            }
            response.send(payload);
        });
        conn.release();
    });
}