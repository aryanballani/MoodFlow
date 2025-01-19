const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recordController = require('../controllers/recordController');
const placesController = require('../services/placesController');
const weatherController = require('../services/weatherController');
const axios = require('axios');


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

// only llm output
// router.get('/activity-suggestions', async (req, res) => {
//     const { latitude, longitude } = req.query;

//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Please provide latitude and longitude.' });
//     }

//     try {
//       // Fetch weather condition
//       const weatherResponse = await axios.get('http://localhost:6000/weather', {
//         params: { latitude, longitude },
//       });
//       const weatherCondition = weatherResponse.data.condition; // E.g., "cold and rainy"
  
//       // Construct the LLM prompt
//       const prompt = `The current weather is ${weatherCondition}. Suggest some activities I can do based on this weather. The output should look like this: [option 1], [option 2], [option 3], etc. This is the format you should follow, do not print anything except the options. strictly stick to the formatting`;
  
//       // Call the LLM API
//       const llmResponse = await axios.post('https://f923-206-87-113-208.ngrok-free.app/api/generate', {
//         model: 'llama3.2:3b',
//         prompt: prompt,
//         stream: false,
//       });

//       // Log the original LLM response (without parsing)
//       console.log('Original LLM Response:', llmResponse.data);
  
//       // Respond with the raw LLM response
//       res.json({ weather: weatherCondition, llmResponse: llmResponse.data });
//     } catch (error) {
//       console.error('Error fetching activity suggestions:', error.message);
      
//       // Log more details if it's an error from the LLM API
//       if (error.response) {
//         console.error('LLM API Error:', error.response.data);
//       }

//       res.status(500).json({ message: 'An error occurred while fetching activity suggestions.' });
//     }
// });


router.get('/activity-suggestions', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide latitude and longitude.' });
    }

    try {
      // Fetch weather condition
      const weatherResponse = await axios.get('http://localhost:6000/weather', {
        params: { latitude, longitude },
      });
      const weatherCondition = weatherResponse.data.condition; // E.g., "cold and rainy"
  
      // Construct the LLM prompt
      const prompt = `The current weather is ${weatherCondition}. Suggest some activities I can do based on this weather. The output should look like this: [option 1], [option 2], [option 3], etc. This is the format you should follow, do not print anything except the options. strictly stick to the formatting`;
  
      // Call the LLM API
      const llmResponse = await axios.post('https://f923-206-87-113-208.ngrok-free.app/api/generate', {
        model: 'llama3.2:3b',
        prompt: prompt,
        stream: false,
      });

      // Log the original LLM response for debugging
      console.log('Original LLM Response:', llmResponse.data);
      
      // Parse the LLM response to extract activities (without "option x" part)
      const activities = llmResponse.data.response.split("\n")
        .map(activity => activity.trim())
        .filter(activity => activity.length > 0)
        .map(activity => activity.replace(/^option \d+: /, ''));  // Remove "option x: "
      
      // Respond with the weather and formatted activities as JSON
      res.json({ weather: weatherCondition, suggestions: activities });
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