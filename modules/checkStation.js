const db = require('../config/connection');
const child = require('child_process');
const module_updateStatus= "./modules/updateStatus";

setTimeout(checkStations, 600000);

function checkStations() {
    console.log("Running every one minute");
    let update = child.fork(module_updateStatus);
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT datetime, station FROM Stations WHERE enabled = 1";
        conn.query(sql1, (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                console.log(res.length);
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
                        console.log(res.station + " is Disarmed");
                    } 
                }
            } 
        });
    });
}