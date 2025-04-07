import { api } from './api';
import { Categoria } from '../interfaces/Categoria';

export const categoriaService = {
  obtenerCategorias: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },
  crearCategoria: async (categoria: Categoria) => {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },
  actualizarCategoria: async (id: string, categoria: Categoria) => {
    const response = await api.put(`/categorias/${id}`, categoria);
    return response.data;
  },
  eliminarCategoria: async (id: string) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },
};