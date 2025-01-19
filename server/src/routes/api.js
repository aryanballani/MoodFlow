const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recordController = require('../controllers/recordController');
const placesController = require('../services/placesController');
const weatherController = require('../services/weatherController');
const axios = require('axios');
require('dotenv').config();

function parseActivitySuggestions(originalResponse) {
  // Clean up the response to make sure we don't have unwanted newlines or spaces
  const cleanedResponse = originalResponse
    .replace(/\n/g, '') // Remove newlines
    .replace(/}{/g, '}|{'); // Temporarily replace }{ with a delimiter

  // Split into individual activity blocks
  const activityBlocks = cleanedResponse
    .split('|') // Split based on the delimiter
    .map(block => block.trim())
    .filter(block => block.length > 0); // Filter out any empty blocks

  // Map over each block and extract title and description using regex
  const activities = activityBlocks.map(block => {
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const descriptionMatch = block.match(/description:\s*"([^"]+)"/);

    if (titleMatch && descriptionMatch) {
      return {
        title: titleMatch[1].trim(),
        description: descriptionMatch[1].trim()
      };
    }
    return null; // Return null if activity doesn't match the expected format
  }).filter(activity => activity !== null); // Remove invalid activities

  return activities;
}

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
router.put('/users/location', userController.updateLocation);

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

router.get('/location', async (req, res) => {
  const { latitude, longitude } = req.query;
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Please provide latitude and longitude.' });
  }

  try {
    console.log('Fetching location from coordinates:', latitude, longitude);
    console.log('API Key:', process.env.GOOGLE_API_KEY);
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


// router.get('/activity-suggestions', async (req, res) => {
//     const { latitude, longitude } = req.query;

//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Please provide latitude and longitude.' });
//     }

//     try {
//       // Fetch weather condition
//       const weatherResponse = await axios.get('http://localhost:5001/weather', {
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

//       // Log the original LLM response for debugging
//       console.log('Original LLM Response:', llmResponse.data);
      
//       // Parse the LLM response to extract activities (without "option x" part)
//       const activities = llmResponse.data.response.split("\n")
//         .map(activity => activity.trim())
//         .filter(activity => activity.length > 0)
//         .map(activity => activity.replace(/^option \d+: /, ''));  // Remove "option x: "
      
//       // Respond with the weather and formatted activities as JSON
//       res.json({ weather: weatherCondition, suggestions: activities });
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
    const weatherResponse = await axios.get('http://localhost:5001/weather', {
      params: { latitude, longitude },
    });
    const weatherCondition = weatherResponse.data.condition; // E.g., "cold and rainy"

    // Construct the LLM prompt with places included at the end
    const prompt = `The current weather is ${weatherCondition}. Suggest some activities I can do based on this weather. Each activity should be formatted as follows:
    {
      title: "3 words max for the title", 
      description: "A short description of the activity, max 1 line"
    }
    After suggesting 5 activities, provide a list of places where these activities can take place. Each place should be a one-word description, without any explanation, listed in a simple array, like this: ["place1", "place2", "place3", "place 4", "place 5"]. 
    Provide 5 activity suggestions and places, do not print anything else, strictly stick to the format.`;

    // Call the LLM API
    const llmResponse = await axios.post('https://f923-206-87-113-208.ngrok-free.app/api/generate', {
      model: 'llama3.2:3b',
      prompt: prompt,
      stream: false,
    });

    // Log the original LLM response for debugging
    console.log('Original LLM Response:', llmResponse.data);

    // Improved parsing of the response
    const responseText = llmResponse.data.response;

    // Step 1: Separate the activities and places part of the response
    const [activitiesText, placesText] = responseText.split('["'); // Split at places section start
    const activities = parseActivitySuggestions(activitiesText); // Parse activities

    // Step 2: Extract places as an array
    const placesMatch = placesText ? placesText.match(/\[(.*?)\]/) : null; // Capture content inside the brackets []
    const places = placesMatch ? placesMatch[1].split(',').map(place => place.replace(/"/g, '').trim()) : [];

    // Add more places if they are missing
    const expectedPlaces = ["Home", "Library", "Studio", "Place 4", "Place 5"];
    const finalPlaces = places.length === 0 ? expectedPlaces : places;

    // Return both the original and formatted responses
    res.json({
      originalResponse: llmResponse.data.response,  // Original LLM response
      weather: weatherCondition,
      suggestions: activities, // Formatted activities
      places: finalPlaces // Updated places list
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