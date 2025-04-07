import { api, API_URL_API } from './api';
import axios from 'axios';

export const authService = {
  login: async (usuario: string, contraseña: string) => {
    const response = await api.post('/login', { usuario, contraseña });
    return response.data;
  },
  logout: async () => {
    const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await axios.post(`${API_URL_API}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener logout:', error);
    throw error;
  }

  }
}
