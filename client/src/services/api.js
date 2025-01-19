// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/'
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  async register(userData) {
    const response = await api.post('/users/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/users/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
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
  }
};