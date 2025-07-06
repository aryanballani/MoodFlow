// llmProxy.js
const { InferenceClient } = require("@huggingface/inference");

const HF_TOKEN = process.env.HF_API_KEY;
const MODEL = process.env.LLM_MODEL || "mistralai/Mistral-7B-Instruct-v0.3";
const PROVIDER = "novita";

const client = new InferenceClient(HF_TOKEN);

const llmProxy = {
  /**
   * Query the HuggingFace LLM chatCompletion endpoint with message history.
   * @param {Array} messages - Array of chat messages (role/content objects).
   * @param {object} [options] - Optional parameters for the LLM.
   * @returns {Promise<any>} - The LLM response.
   */
  async query(messages, options = {}) {
    try {
      // messages should be an array of {role, content}
      const chatCompletion = await client.chatCompletion({
        provider: PROVIDER,
        model: MODEL,
        messages,
        ...options,
      });
      return chatCompletion;
    } catch (error) {
      console.error('LLM Service Error:', error?.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Parse the LLM response and extract suggestions as an array.
   * @param {object} llmResponse - The response object from the LLM.
   * @returns {Array} suggestions
   */
  parseSuggestions(llmResponse) {
    const content = llmResponse.choices?.[0]?.message?.content || '';
    let suggestions = [];
    try {
      // Replace single quotes with double quotes for valid JSON
      const fixedContent = content.replace(/'/g, '"');
      suggestions = JSON.parse(fixedContent);
    } catch (e) {
      console.error('Failed to parse suggestions:', e);
      suggestions = [];
    }
    return suggestions;
  }
};


module.exports = llmProxy;