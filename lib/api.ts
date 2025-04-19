// lib/api.ts
import axios from 'axios';

// 👉 Remplace l’URL par l'adresse de ton backend Symfony local ou en prod
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // ou https://ton-backend.com/api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Middleware pour ajouter automatiquement le token (si tu stockes dans asyncStorage par exemple)
api.interceptors.request.use(async (config) => {
  const token = await getToken(); // ⚠️ getToken à implémenter selon ton auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 💡 Stub (à remplacer par une vraie fonction avec SecureStore ou AsyncStorage)
async function getToken(): Promise<string | null> {
  // Exemple : tu peux utiliser SecureStore ou AsyncStorage ici
  return null; // à remplacer
}

export default api;
