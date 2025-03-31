import axios from 'axios';
import { BASE_URL } from '../config';

const authService = {
  login: async (usuario: string, contraseña: string): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, { usuario, contraseña });
    return response.data;
  },
  logout: async (): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/usuarios/logout`);
    return response.data;
  },
  getCurrentUser: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL}/usuarios/`);
    return response.data;
  },
};

export default authService;