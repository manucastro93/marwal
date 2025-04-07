import { Banner } from '../interfaces/Pagina';
import { Logo } from '../interfaces/Pagina';
import axios from 'axios';
import { api, API_URL_API } from './api';

export const paginaService = {
    obtenerBanners: async (): Promise<Banner[]> => {
        const response = await axios.get(`${API_URL_API}/pagina/banners`);
        return response.data;
    },
  createBanner: async (banner: FormData): Promise<Banner> => {
    const response = await axios.post(`${API_URL_API}/pagina/banners`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updateBanner: async (id: number, banner: FormData): Promise<Banner> => {
    const response = await axios.put(`${API_URL_API}/pagina/banners/${id}`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteBanner: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL_API}/pagina/banners/${id}`);
  },
  getLogo: async (): Promise<Logo> => {
    const response = await axios.get(`${API_URL_API}/pagina/logo`);
    return response.data;
  },
  createOrUpdateLogo: async (logo: FormData): Promise<Logo> => {
    const response = await axios.post(`${API_URL_API}/pagina/logo`, logo, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
export default paginaService;