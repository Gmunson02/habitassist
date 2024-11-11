// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("Token retrieved from localStorage:", token); // Verify token retrieval

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization); // Confirm Authorization header
    } else {
      console.warn("Token is missing"); // Warning if no token is found
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
