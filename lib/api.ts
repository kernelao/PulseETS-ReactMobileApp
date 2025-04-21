// lib/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// 👉 Adresse de ton backend Symfony
const api = axios.create({
  baseURL: API_URL, // change localhost si tu testes sur mobile réel
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Récupère le token depuis AsyncStorage
async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token :', error);
    return null;
  }
}

export default api;
