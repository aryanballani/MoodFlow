// // server/src/controllers/placesController.js
// const axios = require('axios');

// const placesController = {
//   async getNearbyPlaces(req, res) {
//     try {
//       const { location, type } = req.query;

//       if (!location || !type) {
//         return res.status(400).json({ message: 'Please provide a location and place type.' });
//       }

//       // Use Google Geocoding API to convert location to coordinates
//       const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
//       const geocodeResponse = await axios.get(geocodingUrl);

//       if (geocodeResponse.data.status !== 'OK') {
//         return res.status(400).json({ message: 'Failed to get coordinates for the location.' });
//       }

//       const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

//       // Use Google Places API to get nearby places
//       const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
//       const placesResponse = await axios.get(placesUrl);

//       if (placesResponse.data.status !== 'OK') {
//         return res.status(400).json({ message: 'Failed to fetch nearby places.' });
//       }

//       // Map the response to return only place name, address, and Google Maps link
//       const places = placesResponse.data.results.map((place) => ({
//         name: place.name,
//         address: place.vicinity,
//         googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`,
//       }));

//       res.json(places);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ message: 'An error occurred while fetching nearby places.' });
//     }
//   },
// };

// module.exports = placesController;
const axios = require('axios');

const placesController = {
  async getNearbyPlaces(req, res) {
    try {
      const { latitude, longitude, type } = req.query;

      if (!latitude || !longitude || !type) {
        return res.status(400).json({ message: 'Please provide latitude, longitude, and place type.' });
      }

      // Use Google Places API to get nearby places based on latitude and longitude
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=${type}&rankby=prominence&key=${process.env.GOOGLE_API_KEY}`;
      const placesResponse = await axios.get(placesUrl);

      if (placesResponse.data.status !== 'OK') {
        return res.status(400).json({ message: 'Failed to fetch nearby places.' });
      }

      // Map the response to return only place name, address, and Google Maps link
      const places = placesResponse.data.results
        .slice(0, 10)  // Limit the results to the top 5 most relevant places
        .map((place) => ({
          name: place.name,
          address: place.vicinity,
          googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`,
        }));

      res.json({ places });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'An error occurred while fetching nearby places.' });
    }
  },
};

module.exports = placesController;
