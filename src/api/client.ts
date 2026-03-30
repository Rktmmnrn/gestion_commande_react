import axios from 'axios';
import { config } from 'process';

const apiClient = axios.create({
  baseURL:'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json' // pour le debug
  },
  timeout: 10000,
  withCredentials: true, // cookies/sessions
});

// intercepteur pour debug
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data);
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Impossible de contacter le serveur. Vérifiez que Django est lancé sur http://localhost:8000');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
