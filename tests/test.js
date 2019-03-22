const calculator = require('../scripts/calculator');

const raw_data = [
    [6285, 7987, 8764, 8245, 6031, 3358, 2183, -595, -2810, 2289, -1751, 781, 3771, 4912, 7152, 9175, 7692, 5726, 6163, 5995, 3747, 1674, 1096, 1472, 2196, 3604, 5819, 5826, 2452, 1189, 2371, 1842, 2041, 4090, 4996, 4194, 3420, 4631, 5034, 4046, 4816, 4362, 2571, 1540, 378, -177, -175, -272, 613, 4841],
    [-317378, -317456, -317513, -317582, -317584, -317633, -317869, -318160, -318306, -318277, -318216, -318111, -317789, -317286, -316874, -316499, -315980, -315461, -314944, -314522, -314082, -313421, -312611, -311706, -310868, -310080, -309372, -308692, -308019, -307479, -307050, -306795, -306691, -306800, -307097, -307600, -308462, -309558, -310946, -312639, -314529, -316737, -319190, -321770, -324497, -327358, -330267, -333177, -336216, -339338],
    [-8312, -8110, -7814, -7469, -7189, -6821, -6455, -6120, -5804, -5553, -5381, -5247, -5114, -5039, -5028, -5004, -4944, -4876, -4720, -4491, -4215, -3792, -3135, -2306, -1399, -111, 1250, 2768, 4765, 6738, 9146, 11871, 14795, 18266, 21891, 25875, 29973, 34132, 38322, 42152, 45879, 49279, 52399, 55193, 57477, 59395, 60743, 61727, 62441, 62610],
    [275584, 190783, 81755, -50570, -190603, -333057, -475496, -610166, -736762, -842792, -916411, -956240, -959552, -937863, -896392, -835050, -769372, -708069, -655436, -617996, -595851, -586166, -587165, -594226, -594645, -583815, -565285, -533892, -496921, -463925, -426074, -382596, -335129, -283408, -228690, -170636, -113395, -53848, 1544, 46644, 94863, 142886, 187189, 233257, 271509, 304588, 335739, 355322, 370544, 385793],
    [-264442, -264946, -264911, -264543, -264091, -263558, -262908, -262214, -261409, -260430, -259340, -258301, -257473, -256694, -255753, -254722, -253565, -252243, -250855, -249469, -248097, -246878, -246015, -245485, -245152, -244905, -244839, -245072, -245580, -246121, -246585, -247290, -248177, -248957, -249745, -250897, -252572, -254668, -257036, -259463, -261799, -263980, -265918, -267584, -269006, -270205, -271269, -272262, -273124, -2738810],
    [2532, 2472, 2380, 2257, 2148, 2064, 1959, 1883, 1745, 1582, 1476, 1285, 1156, 984, 855, 755, 555, 422, 279, 134, 18, -122, -269, -343, -432, -447, -372, -321, -211, -125, 67, 262, 401, 647, 889, 1132, 1378, 1626, 1900, 2163, 2401, 2623, 2768, 2958, 3175, 3313, 3476, 3590, 3788, 3993]
];
const raw_timestamp = [
    ["2019-03-08T15:07:04.019538Z", "2019-03-08T15:07:41.994538Z"],
    ["2019-03-08T15:09:47.019538Z", "2019-03-08T15:12:34.969538Z"],
    ["2019-03-08T15:10:20.019538Z", "2019-03-08T15:13:39.969538Z"]
];
const station = [
    [7.07, 125.58],
    [24.97, 121.50],
    [19.03, 109.84]
];
var PGDs = [], ATs = [[],[],[]], AT = [], distance = [], ML = [];
//INTEGRATION
for (var i = 0; i < 6; i++) {
    PGDs[i] = calculator.integrateVelocity(raw_data[i]);
}
//PGA
const PGD = Math.max(PGDs[3],PGDs[4],PGDs[5]);
for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
        ATs[i][j] = getTimeFrTimestamp(raw_timestamp[i][j]);
    }
}
//GET S-P
for (var i = 0; i < 3; i++) {

    AT[i] = calculator.getDiffInSeconds(ATs[i][1], ATs[i][0]);
    distance[i] = calculator.getSensorDistance(AT[i]);
    ML[i] = calculator.getMagnitude(PGD, distance[i]);
}
var epicenter = calculator.trilaterate(station[0], station[1], station[2], distance);

function getTimeFrTimestamp(timestamp) {
    date = new Date(timestamp);
    time = date.getTime();
    return time;
}


console.log("PGDs = " + PGDs);
console.log("PGD = " + PGD);
console.log("ATs = " + AT);
console.log("Station Distances = " + distance);
console.log("MLs = " + ML);
console.log("Epicenter = " + epicenter);


