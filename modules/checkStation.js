const db = require('../config/connection');
const child = require('child_process');
const updateStation= "./modules/updateStation";

setInterval(checkStations, 60000);

function checkStations() {
    console.log("Checking Stations activity every 2 mins");   
    db.getConnection((err, conn) => {
        if (err) throw err;
        var sql1 = "SELECT datetime, station FROM Stations WHERE enabled = 1";
        conn.query(sql1, (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                var now = new Date();
                for(var i = 0; i < res.length; i++){
                    var before = new Date(res[i].datetime);
                    console.log(now - before);
                    if ((now - before) > 602000) {
                        const schema = {
                            station: res[i].station,
                            datetime: now,
                            enabled: 0
                        }
			let update = child.fork(updateStation);
                        update.send(schema);
                    } 
                }
            } 
        });
    });
}
