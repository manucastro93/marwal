import { api } from './api';
import { Cliente } from '../interfaces/Cliente';

export const clienteService = {
  obtenerClientes: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },
  actualizarCliente: async (id: string, cliente: Cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },
  obtenerClientePorId: async (id: string) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },
  obtenerClientePorIp: async (ip: string) => {
    const response = await api.get(`/clientes/ip/${ip}`);
    return response.data;
  },
};