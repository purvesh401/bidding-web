/**
 * @file api.js
 * @description Axios instance configured for the auction platform API with interceptors
 * that log requests and surface common error states.
 */

import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

aioRequestInterceptor(api);
aioResponseInterceptor(api);

/**
 * @function aioRequestInterceptor
 * @description Applies request interceptor to log outgoing requests.
 * @param {import('axios').AxiosInstance} instance - Axios instance.
 * @returns {void}
 */
function aioRequestInterceptor(instance) {
  instance.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ API request error:', error);
      return Promise.reject(error);
    }
  );
}

/**
 * @function aioResponseInterceptor
 * @description Applies response interceptor to handle common errors.
 * @param {import('axios').AxiosInstance} instance - Axios instance.
 * @returns {void}
 */
function aioResponseInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        toast.error('Network error: Unable to reach the server.');
        return Promise.reject(error);
      }

      const { status } = error.response;

      if (status === 401) {
        toast.error('Please log in to continue.');
        window.location.href = '/login';
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }

      return Promise.reject(error);
    }
  );
}

export default api;
