import { api } from './api';
import { Categoria } from '../interfaces/Categoria';

export const categoriaService = {
  getCategorias: async (): Promise<Categoria[]> => {
    try {
      const { data } = await api.get('/categorias');
      return data;
    } catch (error: any) {
      console.error('Error obteniendo categorías:', error.message);
      throw new Error('No se pudieron obtener las categorías');
    }
  }
};
