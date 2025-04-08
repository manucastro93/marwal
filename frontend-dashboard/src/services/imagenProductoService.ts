import { api } from './api';

export const imagenProductoService = {
  subirImagen: async (imagen: FormData) => {
    const response = await api.post('/imagenes', imagen);
    return response.data;
  },
  eliminarImagen: async (id: number) => {
    const response = await api.delete(`/imagenes/${id}`);
    return response.data;
  },
};