timer = require('timers');
db = require('../config/connection');

function update() {
    console.log("TEST");
    var counter = 0;
    var thisInterval = setInterval(() => {
        counter = counter + 1;
        console.log(counter);
        if (counter == 2) {
            clearInterval(thisInterval);
            setTimeout(update, 3000);
        }
    }, 1000);
}

setTimeout(update, 1000);



