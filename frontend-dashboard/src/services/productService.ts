import axios from 'axios';
import { Producto } from '../interfaces/Producto';
import { BASE_URL } from '../config';

const productService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await axios.get(`${BASE_URL}productos`);
    return response.data;
  },
  create: async (producto: Producto): Promise<Producto> => {
    const response = await axios.post(`${BASE_URL}productos`, producto);
    return response.data;
  },
  update: async (id: number, producto: Producto): Promise<Producto> => {
    const response = await axios.put(`${BASE_URL}productos/${id}`, producto);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}productos/${id}`);
  },
};

export default productService;