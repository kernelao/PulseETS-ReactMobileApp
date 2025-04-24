// /api/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';
import { navigationRef } from '../navigation/RootNavigation';

const api = axios.create({
  baseURL: 'http://192.168.2.144:8000/api',
  withCredentials: true,
});

// 👉 Ajout automatique du token JWT dans chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Interception des erreurs (ex: token expiré)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      console.warn('⛔ Token expiré ou invalide, déconnexion automatique.');
      await AsyncStorage.removeItem('token');

      // Redirection protégée
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigate('Connexion');
        } else {
          console.warn('⚠️ Navigation non prête, impossible de rediriger.');
        }
      }, 300); // léger délai pour éviter les erreurs de timing
    }

    return Promise.reject(error);
  }
);

export default api; // ✅ ne surtout pas oublier ça
