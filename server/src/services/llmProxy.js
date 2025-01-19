// llmProxy.js
const axios = require('axios');

const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL || 'http://localhost:8000';

const llmProxy = {
  async query(prompt) {
    try {
      const response = await axios.post(`${LLM_SERVICE_URL}/api/v1/generate`, { prompt });
      return response.data;
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw error;
    }
  }
};

module.exports = llmProxy;