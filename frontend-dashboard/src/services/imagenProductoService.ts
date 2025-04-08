import { api } from './api';

export const imagenProductoService = {
  subirImagen: async (formData: FormData) => {
    const response = await api.post('/imagenes', formData);
    return response.data;
  },
  eliminarImagen: async (id: number) => {
    const response = await api.delete(`/imagenes/${id}`);
    return response.data;
  },
};