import axios from 'axios';
import { Banner, Logo } from '../interfaces/Pagina';

const API_URL_API = 'https://catalogo-online-marwal.onrender.com/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const paginaService = {
  obtenerBannersActivos: async (): Promise<Banner[]> => {
    const response = await axios.get(`${API_URL_API}/banners`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  },
  crearBanner: async (banner: FormData): Promise<Banner> => {
    console.log('=> Enviando solicitud para crear banner');
    const response = await axios.post(`${API_URL_API}/banners`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    console.log('=> Respuesta recibida:', response.data);
    return response.data;
  },
  eliminarBanner: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL_API}/banners/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
  },
  obtenerLogo: async (): Promise<Logo> => {
    const response = await axios.get(`${API_URL_API}/logo`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  },
  subirLogo: async (logo: FormData): Promise<Logo> => {
    const response = await axios.post(`${API_URL_API}/logo`, logo, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  },
};

export default paginaService;