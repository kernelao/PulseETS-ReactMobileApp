// /api/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateSafe } from '../navigation/RootNavigation';
import { navigationRef } from '../navigation/RootNavigation';

const api = axios.create({
  baseURL: 'http://192.168.2.144:8000/api',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      console.warn('⛔ Token expiré ou invalide, déconnexion automatique.');
      await AsyncStorage.removeItem('token');

      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigateSafe('Connexion');
        } else {
          console.warn('⚠️ Navigation non prête, impossible de rediriger.');
        }
      }, 300); 
    }

    return Promise.reject(error);
  }
);

export default api;
