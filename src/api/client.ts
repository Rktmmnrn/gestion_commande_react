import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
