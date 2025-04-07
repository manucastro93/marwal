import { api } from './api';
import { ImagenProducto } from '../interfaces/ImagenProducto';

export const imagenProductoService = {
  subirImagen: async (imagen: ImagenProducto) => {
    const response = await api.post('/imagenes', imagen);
    return response.data;
  },
  eliminarImagen: async (id: string) => {
    const response = await api.delete(`/imagenes/${id}`);
    return response.data;
  },
};