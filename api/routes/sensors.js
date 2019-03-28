const express = require('express');
const SensorsController = require('../controllers/sensorsController');
const router = express.Router();

//router.use(express.json());
router.POST('/', SensorsController.update_sensor);
module.exports = router;
