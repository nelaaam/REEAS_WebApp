const express = require('express');
const StationsController = require('../controllers/stationsController');
const router = express.Router();

router.use(express.json());
router.post('/', StationsController.update_station);
module.exports = router;

