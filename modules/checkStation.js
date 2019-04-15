const db = require('../config/connection');
const child = require('child_process');
const updateStation= "./modules/updateStation";

setInterval(checkStations, 60000);

function checkStations() {
    console.log("Running every one minute");
    let update = child.fork(updateStation);
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT datetime, station FROM Stations WHERE enabled = 1";
        conn.query(sql1, (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
console.log(new Date());
console.log(res);
                var now = new Date();
                for(var i = 0; i < res.length; i++){
                    var before = new Date(res[i].datetime);
                    console.log(now - before);
                    if ((now - before) > 605000) {
                        const schema = {
                            station: res[i].station,
                            datetime: now,
                            enabled: 0
                        }
                        update.send(schema);
                    } 
                }
            } 
        });
    });
}
