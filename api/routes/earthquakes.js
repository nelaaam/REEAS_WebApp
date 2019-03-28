const express = require('express');
const EarthquakesController = require('../controllers/earthquakesController');
const router = express.Router();

router.use(express.json());
router.get('/', EarthquakesController.get_default);
router.get('/:year', EarthquakesController.get_by_year);
router.get('/:year/:magnitude', EarthquakesController.get_by_year_magnitude);

module.exports = router;

