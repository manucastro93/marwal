import axios from 'axios';
import { Banner, Logo } from '../interfaces/Pagina';
import { BASE_URL } from '../config';

export const paginaService = {
  obtenerBannersActivos: async (): Promise<Banner[]> => {
    const response = await axios.get(`${BASE_URL}/banners`);
    return response.data;
  },
  obtenerLogo: async (): Promise<Logo> => {
    const response = await axios.get(`${BASE_URL}/logo`);
    return response.data;
  }
};

export default paginaService;