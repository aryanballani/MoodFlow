// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/'
});

  
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const userService = {
  async register(userData) {
    const response = await api.post('/users/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async login(credentials) {
    console.log(credentials);
    const response = await api.post('/users/login', credentials);
    console.log(response);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async updateProfile(userData) {
    console.log('updateProfile');
    console.log(userData);
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateLocation(locationData) {
    const response = await api.put('/users/location', locationData);
    return response.data;
  }
};

export const recordService = {
  async createRecord(recordData) {
    const response = await api.post('/records', recordData);
    return response.data;
  },

  async getUserRecords(filters = {}) {
    const response = await api.get('/records', { params: filters });
    return response.data;
  },

  async updateRecord(id, recordData) {
    const response = await api.put(`/records/${id}`, recordData);
    return response.data;
  },

  async getMoodAnalytics() {
    const response = await api.get('/records/analytics');
    return response.data;
  },

  async getActivitySuggestions(latitude, longitude, DOB, interests, mood) {
    const response = await api.get('/activity-suggestions', {
      params: {
        latitude,
        longitude,
        DOB,
        interests,
        mood
      }
    });
    return response.data;
  },

  async getNearbyPlaces(latitude, longitude, type) {
    const response = await api.get('/places', {
      params: { latitude, longitude, type } // Single type parameter
    });

    return response.data;
}

};