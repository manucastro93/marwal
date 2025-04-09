import { api } from './apiService';
import { Vendedor } from '../interfaces/Vendedor';

export const vendedorService = {
  getVendedorByLink: async (link: string): Promise<Vendedor> => {
    try {
      const { data } = await api.get(`/vendedores/by-link/${link}`);
      return data;
    } catch (error: any) {
      console.error('Error obteniendo vendedor:', error.message);
      throw new Error('No se pudo obtener el vendedor');
    }
  }
};
