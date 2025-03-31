import axios from 'axios';
import { Producto } from '../interfaces/Producto';

const productService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await axios.get('/api/productos');
    return response.data;
  },
  create: async (producto: Producto): Promise<Producto> => {
    const response = await axios.post('/api/productos', producto);
    return response.data;
  },
  update: async (id: number, producto: Producto): Promise<Producto> => {
    const response = await axios.put(`/api/productos/${id}`, producto);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/api/productos/${id}`);
  },
};

export default productService;