import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// 🔥 Interceptor: Add token to secure requests only
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  // 👇 Skip token for open endpoints
  if (!config.url.includes('register') && !config.url.includes('token')) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;
