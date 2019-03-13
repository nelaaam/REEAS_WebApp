const express = require('express');
const DetectionController = require('../controllers/detectionController');
const router = express.Router();

//router.use(express.json());
router.get('/', EarthquakesController.get_all);
//router.get('/:id', EarthquakesController.get_all);
//router.get('/:year', EarthquakesController.get_by_year);
//router.get('/:magnitude', EarthquakesController.get_by_magnitude);

module.exports = router;
