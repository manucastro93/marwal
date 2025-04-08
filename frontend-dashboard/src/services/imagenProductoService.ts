import { api } from './api';

export const imagenProductoService = {
  subirImagen: async (imagen: FormData) => {
    const response = await api.post('/imagenes', imagen, {
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