const express = require('express');
const DetectionsController = require('../controllers/detectionsController');
const router = express.Router();

//router.use(express.json());
router.post('/', DetectionsController.post_new_detection);

module.exports = router;