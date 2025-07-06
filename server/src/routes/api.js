const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recordController = require('../controllers/recordController');
const placesController = require('../services/placesController');
const weatherController = require('../services/weatherController');
const llmProxy = require('../services/llmProxy');
const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
require('dotenv').config();

// Load YAML prompt once at startup
const promptYaml = yaml.load(
  fs.readFileSync(path.join(__dirname, '../prompts/prompts.yaml'), 'utf8')
);

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
router.get('/users/profile', userController.getProfile);
router.put('/users/location', userController.updateLocation)


router.get('/location', async (req, res) => {
  const { latitude, longitude } = req.query;
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Please provide latitude and longitude.' });
  }

  try {
    console.log('Fetching location from coordinates:', latitude, longitude);
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`);
    const data = response.data;
    const location = data.results[0]?.formatted_address || 'Location not found';
    console.log('Location:', location);
    res.json({ location });
  } catch (error) {
    console.error('Error fetching location from coordinates:', error);
    res.status(500).json({ message: 'An error occurred while fetching the location.' });
  }
});

router.get('/places', async (req, res) => {
  try {
    const { latitude, longitude, type } = req.query; // Single type instead of types array
    console.log('Fetching nearby places:', latitude, longitude, type);
    // Ensure all required parameters are provided
    if (!latitude || !longitude || !type) {
      return res.status(400).json({ message: 'Please provide latitude, longitude, and type.' });
    }

    // Call the controller with the single type
    console.log('Fetching nearby places:', latitude, longitude, type);
    const placesResponse = await placesController.getNearbyPlaces({ latitude, longitude, type });

    // Return the response
    res.json({
      places: placesResponse // Directly return the response from controller
    });
  } catch (error) {
    console.error('Error fetching places:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching places.' });
  }
});


router.get('/activity-suggestions', async (req, res) => {
  const { latitude, longitude, age, interests, mood } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Please provide latitude and longitude.' });
  }

  try {
    const weatherResponse = await weatherController.fetchWeatherCondition(latitude, longitude);
    const weatherCondition = weatherResponse.condition || '';

    // Replace placeholders in the prompt
    let prompt = promptYaml.activity_prompt
      .replace('{{weatherCondition}}', weatherCondition)
      .replace('{{age}}', age)
      .replace('{{interests}}', interests)
      .replace('{{mood}}', mood);

    // Use llmProxy to call the LLM API
    const message_history = [
      { "role": "system", "content": prompt },
      { "role": "user", "content": "Give me a list of json objects in one line" },
    ];

    const llmResponse = await llmProxy.query(message_history);

    // Log the original LLM response for debugging
    console.log('Original LLM Response:', llmResponse);

    // Use the new parseSuggestions function
    const validatedSuggestions = llmProxy.parseSuggestions(llmResponse);

    console.log('Validated Suggestions:', validatedSuggestions);
    // Return both the original and formatted responses
    res.json({
      originalResponse: llmResponse,
      weather: weatherCondition,
      suggestions: validatedSuggestions,
    });
  } catch (error) {
    console.error('Error fetching activity suggestions:', error.message);

    // Log more details if it's an error from the LLM API
    if (error.response) {
      console.error('LLM API Error:', error.response.data);
    }

    res.status(500).json({ message: 'An error occurred while fetching activity suggestions.' });
  }
});


module.exports = router;