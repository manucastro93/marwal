import { api } from './api';
import { Banner, Logo } from '../interfaces/Pagina';

export const paginaService = {
  obtenerBannersActivos: async (): Promise<Banner[]> => {
    try {
      const { data } = await api.get('/banners');
      return data;
    } catch (error: any) {
      console.error('Error obteniendo banners:', error.message);
      throw new Error('No se pudieron obtener los banners');
    }
  },

  obtenerLogo: async (): Promise<Logo> => {
    try {
      const { data } = await api.get('/logo');
      return data;
    } catch (error: any) {
      console.error('Error obteniendo logo:', error.message);
      throw new Error('No se pudo obtener el logo');
    }
  }
};
