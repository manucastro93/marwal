import axios from 'axios';
import { BASE_URL } from '../config';

const authService = {
  login: async (usuario: string, contraseña: string): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, { usuario, contraseña }, {
      withCredentials: true // Permitir que las cookies se envíen con las solicitudes
    });
    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token); // Almacenar el token en localStorage
    }
    return response.data;
  },
  logout: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/usuarios/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Permitir que las cookies se envíen con las solicitudes
    });
    localStorage.removeItem('token'); // Remover el token del almacenamiento local
    return response.data;
  },
  getCurrentUser: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await axios.get(`${BASE_URL}/usuarios/current`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true // Permitir que las cookies se envíen con las solicitudes
      });
      return response.data; // Aquí debe devolver los datos del usuario actual
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          // Token expirado, intentar renovar
          const newTokenResponse = await axios.post(`${BASE_URL}/usuarios/renovar-token`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true // Permitir que las cookies se envíen con las solicitudes
          });
          const newToken = newTokenResponse.data.token;
          if (newToken) {
            localStorage.setItem('token', newToken);
            // Reintentar obtener el usuario actual con el nuevo token
            const retryResponse = await axios.get(`${BASE_URL}/usuarios/current`, {
              headers: {
                Authorization: `Bearer ${newToken}`
              },
              withCredentials: true // Permitir que las cookies se envíen con las solicitudes
            });
            return retryResponse.data;
          }
        }
      }
      throw error;
    }
  },
};

export default authService;