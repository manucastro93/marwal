import { api, API_URL_API } from './api';
import axios from 'axios';
import { Vendedor } from '../interfaces/Vendedor';

export const vendedorService = {
  obtenerVendedores: async () => {
    const response = await api.get(`/vendedores`);
    return response.data;
  },
  obtenerVendedorPorId: async (id: string) => {
    const response = await api.get(`/vendedores/${id}`);
    return response.data;
  },
  crearVendedor: async (vendedor: Vendedor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL_API}/vendedores`, vendedor, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log('Respuesta de la creación de vendedor:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          throw errorData.errors;
        } else if (errorData?.message) {
          throw { message: errorData.message };
        }
      }
      throw { message: 'Error de conexión' };
    }
  },
  actualizarVendedor: async (id: string, vendedor: Vendedor) => {
    const response = await api.put(`/vendedores/${id}`, vendedor);
    return response.data;
  },
  eliminarVendedor: async (id: string) => {
    const response = await api.delete(`/vendedores/${id}`);
    return response.data;
  },
};