import { api } from './apiService';
import { Producto } from '../interfaces/Producto';

export const productoService = {
  getProductos: async (): Promise<Producto[]> => {
    try {
      const { data } = await api.get('/productos');
      return data;
    } catch (error: any) {
      console.error('Error obteniendo productos:', error.message);
      throw new Error('No se pudieron obtener los productos');
    }
  }
};
