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
    const errorMessage = error.message || 'An error occurred';
    const customId = error.response?.status || 500;
    toast.error(errorMessage, { toastId: customId });
    return Promise.reject(error);
  }
);

export const getVideoGamesListAPI = async (searchTerm = '') => {
  try {
    const response = await api.get('/video-games', { params: { search: searchTerm } });
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

export const getGameDetailsAPI = async (gameId) => {
  try {
    const response = await api.get(`/game/${gameId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
