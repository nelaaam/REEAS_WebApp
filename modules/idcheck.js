db = require('../config/connection');
process.on('message', (msg) => {
    var current_event, new_event, last_event, last, now;
    db.getConnection((err, conn) => {
        sql1 = "SELECT event, datetime, status FROM Events ORDER BY sample DESC LIMIT 1;";
        sql2 = "SELECT event FROM Earthquakes ORDER BY event DESC LIMIT 1; SELECT event FROM False_Triggers ORDER BY event DESC LIMIT 1";
        sql3 = "UPDATE Events SET status = ? WHERE event = ? AND status IS NULL";
        sql4 = "INSERT INTO False_Triggers (event, datetime) SELECT event, datetime FROM Events WHERE event = ?; UPDATE Events SET status = 'False Trigger' WHERE event = ?";
        if (err) throw err;
        conn.query(sql1, (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                last = new Date(res[0].datetime);
                now = new Date(msg.datetime * 1000);
                current_event = res[0].event;
                if (res[0].status == 'False Trigger') {
                    process.send(current_event + 1);
                    endProcess;
                } else if (res[0].status == 'Not Yet Verified') {
                    if ((now - last) >= 300000) {
                        new_event = current_event + 1;
                        process.send(new_event);
                        conn.query(sql4, [current_event, current_event], (err, res) => {
                            if (err) throw (err);
                            if (res.affectedRows > 0) {
                                endProcess(conn);
                            }
                        });
                    } else {
                        process.send(current_event);
                        endProcess(conn);
                    }
                } else if (res[0].status == "Earthquake") {
                    conn.query(sql2, (err, res) => {
                        if (err) throw err;
                        if (res[0].length > 0 && res[1].length > 0) {
                            if (res[0][0].event > res[1][0].event) last_event = res[0][0].event;
                            else last_event = res[1][0].event;
                        } else if (res[0].length > 0)  last_event = res[0][0].event;
                        else if (res[1].length > 0) last_event = res[1][0].event;
                        else {
                            process.send(1);
                            endProcess(conn);
                        }
                        if(current_event == last_event) {
                            new_event = last_event + 1;
                            process.send(new_event);
                            endProcess(conn);
                        } else {
                            process.send(current_event);
                            endProcess(conn);
                        }
                    });
                }
            } else {
                process.send(1);
                endProcess(conn);
            }
        });
    });
});

function endProcess(conn) {
    conn.release();
    process.exit();
}
