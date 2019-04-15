const assert = require('chai').assert;
const app = require('../scripts/calculator');

//Data Results
trilaterateActual = app.trilaterate([42.02,143.16], [46.96,142.76], [36.55,138.2], [124.9441, 476.5567, 749.6646]);
trilaterateActual_Latitude = trilaterateActual[0];
trilaterateActual_Longitude = trilaterateActual[1];
trilaterateExpected = [42.6861,	141.9294];
trilaterateExpected_Latitude = 42.6861;
trilaterateExpected_Longitude = 141.9294;

magnitudeActual = app.getMagnitude(13.07095, 357.86);
magnitudeExpected = 6.0;

distanceActual = app.getSensorDistance(37.975);
distanceExpected = 3.34 * 110.57;

timeDiffActual = app.getDiffInSeconds(7000, 1000);
timeDiffExpected = 6;

eventStartActual = app.getEventStart(new Date("2019-03-08T15:07:04.019538Z"), 357.86).getTime();
eventStartExpected = new Date("2019-03-08 15:06:12").getTime();
describe("Calculator - Trilaterate", function() {
    it("Trilaterate should return array" , function() {
        assert.typeOf(trilaterateActual, 'array');
    });
    it("Trilaterate should return array with length of two", function() {
        assert.lengthOf(trilaterateActual, 2);
    });
    it("Trilaterate should return latitude +/- 0.5 to expected", function() {
        assert.closeTo(trilaterateActual_Latitude, trilaterateExpected_Latitude, 0.5);
    });
    it("Trilaterate should return longitude +/- 0.5 to expected", function() {
        assert.closeTo(trilaterateActual_Longitude, trilaterateExpected_Longitude, 0.5);
    });
});
describe("Calculator - getMagnitude", function() {
    it("getMagnitude should return a number", function() {
        assert.typeOf(magnitudeActual, 'number');
    });
    it("getMagnitude should return magnitude +/- 0.1 to expected", function() {
        assert.closeTo(magnitudeActual, magnitudeExpected, 0.1);
    });
});
describe("Calculator - getSensorDistance", function() {
    it("getSensorDistance should return a number", function() {
        assert.typeOf(distanceActual, 'number');
    });
    it("getSensorDistance should return magnitude +/- 0.5° to expected", function() {
        assert.closeTo(distanceActual, distanceExpected, 55.285);
    });
});
describe("Calculator - getDiffInSeconds", function() {
    it("getDiffInSeconds should return a number", function() {
        assert.typeOf(timeDiffActual, 'number');
    });
    it("getDiffInSeconds should return actual equal expected", function() {
        assert.equal(timeDiffActual, timeDiffExpected);
    });
});
describe("Calculator - getEventStart", function() {
    it("getEventStart should return close to expected", function() {
        assert.closeTo(eventStartActual, eventStartExpected, 10000);
    });
});