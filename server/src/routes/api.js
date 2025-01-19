const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recordController = require('../controllers/recordController');
const placesController = require('../services/placesController');
const weatherController = require('../services/weatherController');

// User routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.put('/users/profile', userController.updateProfile);

// Record routes
router.post('/records', recordController.createRecord);
router.get('/records', recordController.getUserRecords);
router.put('/records/:id', recordController.updateRecord);
router.get('/records/analytics', recordController.getMoodAnalytics);
router.get('/places', placesController.getNearbyPlaces);
router.get('/weather', weatherController.getWeatherCondition);
module.exports = router;