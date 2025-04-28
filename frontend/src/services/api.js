import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// 🔥 Interceptor: Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // <--- camelCase (like before)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
