const axios = require('axios');

const weatherController = {
  async getWeatherCondition(req, res) {
    try {
      const { latitude, longitude } = req.query;

      // Validate query parameters
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
      }

      const { condition } = await fetchWeatherCondition(latitude, longitude);

      // Send the response
      res.json({ condition });
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      res.status(500).json({ message: 'Unable to fetch weather conditions' });
    }
  },
};

async function fetchWeatherCondition(latitude, longitude) {
  // Open-Meteo API URL and parameters
  const url = `https://api.open-meteo.com/v1/forecast`;
  const params = {
    latitude,
    longitude,
    hourly: 'temperature_2m,relative_humidity_2m,cloud_cover,precipitation,precipitation_probability,wind_speed_10m',
    timezone: 'auto',
  };

  const response = await axios.get(url, { params });
  const weatherData = response.data;

  // Initialize condition flags
  let isSunny = false;
  let isRainy = false;
  let isWindy = false;
  let isCold = false;
  let isHot = false;
  let isHumid = false;

  // Parse hourly data
  const hourlyData = weatherData.hourly;
  hourlyData.time.forEach((_, index) => {
    const temperature = hourlyData.temperature_2m[index];
    const humidity = hourlyData.relative_humidity_2m[index];
    const cloudCover = hourlyData.cloud_cover[index];
    const precipitation = hourlyData.precipitation[index];
    const precipitationProbability = hourlyData.precipitation_probability[index];
    const windSpeed = hourlyData.wind_speed_10m[index];

    // Update flags based on thresholds
    if (temperature < 5) isCold = true; // Cold if temperature < 5°C
    if (temperature > 30) isHot = true; // Hot if temperature > 30°C
    if (humidity > 80) isHumid = true; // Humid if humidity > 80%
    if (cloudCover < 20 && precipitation === 0) isSunny = true; // Sunny if cloud cover < 20% and no rain
    if (precipitation > 0 || precipitationProbability > 50) isRainy = true; // Rainy if precipitation > 0 or high probability
    if (windSpeed > 20) isWindy = true; // Windy if wind speed > 20 km/h
  });

  // Determine the overall condition
  let conditions = [];
  if (isCold) conditions.push('cold');
  if (isHot) conditions.push('hot');
  if (isHumid) conditions.push('humid');
  if (isRainy) conditions.push('rainy');
  if (isWindy) conditions.push('windy');
  if (isSunny && !conditions.length) conditions.push('sunny');

  // Combine conditions into a single string
  const condition = conditions.length > 0 ? conditions.join(' and ') : 'clear';

  return { condition };
}

module.exports = {
  getWeatherCondition: weatherController.getWeatherCondition,
  fetchWeatherCondition, // <-- add this line to export the pure function
};
