import { api } from './api';
import { Cliente } from '../interfaces/Cliente';

export const clienteService = {
  saveOrUpdateCliente: async (cliente: Cliente): Promise<Cliente> => {
    try {
      const { data } = await api.post('/clientes/clientes', cliente);
      return data;
    } catch (error: any) {
      console.error('Error guardando cliente:', error.message);
      throw new Error('No se pudo guardar el cliente');
    }
  },

  getClienteByIp: async (ip: string): Promise<Cliente | null> => {
    try {
      const { data } = await api.get(`/clientes/ip/${ip}`);
      return data;
    } catch (error: any) {
      console.error('Error obteniendo cliente por IP:', error.message);
      throw new Error('No se pudo obtener el cliente por IP');
    }
  }
};
