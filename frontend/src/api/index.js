import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
