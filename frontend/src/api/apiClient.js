import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const ACCESS_TOKEN_KEY = 'scholamatch_user_token'; // Using the user's original key name for safety

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    console.log(`[DEBUG] API Request to ${config.url} using token style: ${token ? 'PRESENT' : 'MISSING'}`);
    
    if (token) {
      // Support both "Token <token>" and ensure consistency
      // Our backend CustomTokenAuthentication handles both "Token" and "Bearer"
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[DEBUG] 401 Unauthorized detected. Status:', error.response.status);
      // Optional: Logic to handle logout or refreshing
    }
    return Promise.reject(error);
  }
);

export default apiClient;
