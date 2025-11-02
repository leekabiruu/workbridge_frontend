import api from './services/api.js';

api.get('/health')
  .then(response => console.log('API connected:', response.data))
  .catch(error => console.error('API error:', error.response?.status, error.message));
  