import { api } from './api';

export const imagenProductoService = {
  subirImagen: async (imagenes: FormData) => {
    const response = await api.post('/imagenes/multiples', imagenes, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  eliminarImagen: async (id: number) => {
    const response = await api.delete(`/imagenes/${id}`);
    return response.data;
  },
};