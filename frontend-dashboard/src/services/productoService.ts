import { api } from './api';
import { Producto } from '../interfaces/Producto';

export const productoService = {
  obtenerProductos: async () => {
    const response = await api.get('/productos');
    return response.data;
  },
  obtenerProductoPorId: async (id: string) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },
  obtenerProductoPorNombre: async (nombre: string) => {
    const response = await api.get(`/productos/nombre/${nombre}`);
    return response.data;
  },
  crearProducto: async (producto: Producto) => {
    const response = await api.post('/productos', producto);
    return response.data;
  },
  actualizarProducto: async (id: string, producto: Producto) => {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },
  eliminarProducto: async (id: string) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};