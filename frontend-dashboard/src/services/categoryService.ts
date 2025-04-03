import axios from 'axios';
import { Categoria } from '../interfaces/Categoria';

const categoryService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await axios.get('/api/categorias');
    return response.data;
  },
  create: async (categoria: Categoria): Promise<Categoria> => {
    const response = await axios.post('/api/categorias', categoria);
    return response.data;
  },
  update: async (id: number, categoria: Categoria): Promise<Categoria> => {
    const response = await axios.put(`/api/categorias/${id}`, categoria);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/api/categorias/${id}`);
  },
};

export default categoryService;