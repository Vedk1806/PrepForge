// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',
// });

// // 🔥 Interceptor: Add token to secure requests only
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');

//   // 👇 Skip token for open endpoints
//   if (!config.url.includes('register') && !config.url.includes('token')) {
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// export default API;


import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Request interceptor: attach token unless it's for login/register
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (!config.url.includes('register') && !config.url.includes('token')) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor: refresh token if access token is expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
