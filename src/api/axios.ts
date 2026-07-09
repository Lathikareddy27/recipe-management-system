// Axios API client for connecting to the real Express backend.
// Currently the app uses the mock API (mockApi.ts) for in-browser demo.
// To use the real backend:
//   1. Start the server (cd server && npm install && npm start)
//   2. Set VITE_API_URL in .env to your server URL (e.g. http://localhost:5000)
//   3. Replace mockApi imports with this axios client throughout the app.

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('rms_current_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
