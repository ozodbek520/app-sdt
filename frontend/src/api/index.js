import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
      const csrfToken = Cookies.get('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      } else {
        toast.warn('CSRF token not found');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error', error);
    const errorMessage = error.response.data || 'An error occurred';
    const customId = error.response?.status || 500;
    toast.error(errorMessage, { toastId: customId });
    return Promise.reject(error);
  }
);

const getAndSetCSRFToken = async () => {
  try {
    await api.get('/set-csrf-token');
  } catch (error) {
    console.error('Error setting CSRF token:', error);
  }
};

getAndSetCSRFToken();

export const getVideoGamesListAPI = async (searchTerm = '', page = 1) => {
  try {
    const response = await api.get('/video-games', { params: { search: searchTerm, page } });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBestPlayersListAPI = async (searchTerm = '') => {
  try {
    const response = await api.get('/best-players', { params: { search: searchTerm } });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBestCompaniesListAPI = async () => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getGameDetailsAPI = async (gameId) => {
  try {
    const response = await api.get(`/game/${gameId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBestPlayerDetailsAPI = async (gameId) => {
  try {
    const response = await api.get(`/best-players-details/${gameId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCompanyDetailsAPI = async (companyId) => {
  try {
    const response = await api.get(`/company-details/${companyId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const askAIandFetchResponsesAPI = async (message) => {
  try {
    const response = await api.post('/chat-ai/', { text: message });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
