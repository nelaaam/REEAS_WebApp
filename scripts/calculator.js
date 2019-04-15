const math = require('mathjs');

const delta = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0, 79.0, 80.0, 81.0, 82.0, 83.0, 84.0, 85.0, 86.0, 87.0, 88.0, 89.0, 90.0, 91.0, 92.0, 93.0, 94.0, 95.0, 96.0, 97.0, 98.0, 99.0, 100.0, 101.0, 102.0, 103.0, 104.0, 105];
const lagTime = [3.8, 7.6, 13.1, 18.7, 24.1, 29.7, 35.2, 39.9, 46.4, 51.9, 57.4, 63.0, 68.5, 73.9, 79.3, 84.8, 90.3, 95.8, 101.3, 106.8, 112.2, 122.9, 133.7, 144.4, 155.2, 165.7, 176.1, 186.6, 196.8, 207, 218.1, 227.1, 235.8, 244, 251.8, 259.1, 266.2, 273.4, 280.4, 287.5, 294.5, 301.4, 308.2, 315.1, 322, 328.9, 336.8, 342.8, 349.6, 356.5, 363.2, 369.8, 376.4, 382.8, 389.3, 395.7, 402, 408.4, 414.7, 421, 427.2, 433.4, 439.7, 445.8, 452, 458.1, 464.3, 470.3, 476.4, 482.5, 488.5, 494.5, 500.5, 506.3, 512.3, 518.1, 523.9, 529.7, 535.4, 541.1, 546.8, 552.3, 558, 563.4, 568.8, 574.2, 579.5, 584.7, 590, 595.1, 600.2, 605.3, 610.4, 615.4, 620.3, 625.2, 630, 634.7, 639.3, 643.8, 648.3, 652.5, 656.7, 660.9, 665.0, 668.9, 672.9, 676.8, 680.7, 684.6, 688.4, 692.3, 696.1, 700.1, 704, 747.9];

var Station = function (lat, lon, dist) {
    this.lat = lat
    this.lon = lon
    this.dist = dist
    return this
}

getClosest = function (val1, val2, lt) {
    if (lt - val1 >= val2 - lt)
        return val2;
    else
        return val1;
}

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
}

module.exports = {
    getDisplacementFromAcceleration: function (data) {
        var vel = [0, 0];
        var acc = [0, 0];
        var pos = [0, 0];
        var ap = [], a2p = [];
        for (i = 0; i < data.length; i++) {
            acc[1] = data[i];
            vel[1] = vel[0] + acc[0] * 0.025 + ((acc[1] - acc[0]) / 2) * 0.025;
            pos[1] = pos[0] + vel[0] * 0.025 + ((vel[1] - vel[0]) / 2) * 0.025;
            ap[i] = vel[1];
            a2p[i] = pos[1];
            acc[0] = acc[1];
            vel[0] = vel[1];
            pos[0] = pos[1];
        }
        return Math.max(...a2p) / 1000;
    },
    getDisplacementFromVelocity: function (data) {
        var vel = [0, 0];
        var pos = [0, 0];
        var a2p = [];
        for (i = 0; i < data.length; i++) {
            vel[1] = data[i];
            pos[1] = pos[0] + vel[0] * 0.025 + ((vel[1] - vel[0]) / 2) * 0.025;
            a2p[i] = pos[1];
            vel[0] = vel[1];
            pos[0] = pos[1];
        }
        return Math.max(...a2p) / 1000;
    },
    getMagnitude: function (peak_amplitude, distance) {
        //magnitude = Math.log10(peak_amplitude) + 2.56 * Math.log10(distance) - 1.67;
        if(distance < 200) {
            magnitude = Math.log10(peak_amplitude) + 1.6 * Math.log10(100) - 0.15;
        } else {
            magnitude = Math.log10(peak_amplitude) + 3.0 * Math.log10(distance) - 3.38;
        }
        return magnitude;
    },
    getDiffInSeconds: function (t2, t1) {
        return (t2 - t1) / 1000;
    },
    getSensorDistance: function (lt) {
        var n = delta.length;
    
        if (lt <= lagTime[0])
            return lagTime[0];
        if (lt >= lagTime[n - 1])
            return lagTime[n - 1];
    
        var i = 0, j = n, mid = 0;
        while (i < j) {
            mid = parseInt((i + j) / 2, 10);
    
            if (lagTime[mid] == lt)
                lagTime[mid];
            if (lt < lagTime[mid]) {
                if (mid > 0 && lt > lagTime[mid - 1]) getClosest(lagTime[mid - 1], lagTime[mid], lt);
                j = mid;
            }
            else {
                if (mid < n - 1 && lt < lagTime[mid + 1]) getClosest(lagTime[mid], lagTime[mid + 1], lt);
                i = mid + 1;
            }
        }
        return ((delta[mid] * lt) / lagTime[mid]) * 110.57;
    },
    trilaterate: function (P1, P2, P3, distances) {
        var station = [
            new Station(P1[0], P1[1], distances[0]),
            new Station(P2[0], P2[1], distances[1]),
            new Station(P3[0], P3[1], distances[2])
        ];
        var earthR = 6371
            , rad = function (deg) {
                return deg * (math.pi / 180)
            }
            , deg = function (rad) {
                return rad * (180 / math.pi)
            }
        var P1 = [earthR * (math.cos(rad(station[0].lat)) * math.cos(rad(station[0].lon)))
            , earthR * (math.cos(rad(station[0].lat)) * math.sin(rad(station[0].lon)))
            , earthR * (math.sin(rad(station[0].lat)))
        ]
        var P2 = [earthR * (math.cos(rad(station[1].lat)) * math.cos(rad(station[1].lon)))
            , earthR * (math.cos(rad(station[1].lat)) * math.sin(rad(station[1].lon)))
            , earthR * (math.sin(rad(station[1].lat)))
        ]
        var P3 = [earthR * (math.cos(rad(station[2].lat)) * math.cos(rad(station[2].lon)))
            , earthR * (math.cos(rad(station[2].lat)) * math.sin(rad(station[2].lon)))
            , earthR * (math.sin(rad(station[2].lat)))
        ]
        var ex = math.divide(math.subtract(P2, P1), math.norm(math.subtract(P2, P1)))
        var i = math.dot(ex, math.subtract(P3, P1))
    
        var ey = math.divide(
            math.subtract(
                math.subtract(P3, P1),
                math.multiply(i, ex)
            ),
            math.norm(
                math.subtract(
                    math.subtract(P3, P1),
                    math.multiply(i, ex)
                )
            )
        )
    
        var ez = math.cross(ex, ey)
        var d = math.norm(math.subtract(P2, P1))
        var j = math.dot(ey, math.subtract(P3, P1))
    
        var x = (math.pow(station[0].dist, 2) - math.pow(station[1].dist, 2) + math.pow(d, 2)) / (2 * d)
        var y = ((math.pow(station[0].dist, 2) - math.pow(station[2].dist, 2) + math.pow(i, 2) + math.pow(j, 2)) / (2 * j)) - ((i / j) * x)
    
        var z = math.sqrt(math.abs(math.pow(station[0].dist, 2) - math.pow(x, 2) - math.pow(y, 2)))
    
        var triPt = math.add(
            math.add(
                math.add(P1,
                    math.multiply(x, ex)
                ),
                math.multiply(y, ey)
            ),
            math.multiply(z, ez)
        )
    
        var lat = deg(math.asin(math.divide(triPt[2], earthR)))
        var lon = deg(math.atan2(triPt[1], triPt[0]))
    
        return [lat, lon]
    
    }, 
    getEventStart: function(earliestTime, minDistance) {
        return new Date(earliestTime - ((minDistance / 6) * 1000));
    },
    getAccelerationFromG: function(data) {
        var acceleration = [], i;
        for(i = 0; i < data.length; i++){
            acceleration[i] = data[i] / 0.0000167081378; //nM per sec
        }
        return acceleration;
    },
    getVelocityFromAcceleration: function(data) {
        var vel = [0, 0];
        var acc = [0, 0];
        var pos = [0, 0];
        var ap = [];
        for (i = 0; i < data.length; i++) {
            acc[1] = data[i];
            vel[1] = vel[0] + acc[0] * 0.025 + ((acc[1] - acc[0]) / 2) * 0.025;
            ap[i] = vel[1];
            acc[0] = acc[1];
            vel[0] = vel[1];
        }
        return ap;
    }
    
}

