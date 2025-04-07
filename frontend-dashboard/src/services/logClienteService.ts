import { api } from './api';
import { LogCliente } from '../interfaces/LogCliente';

export const logClienteService = {
  obtenerLogs: async () => {
    const response = await api.get('/logs');
    return response.data;
  },
  crearLog: async (log: LogCliente) => {
    const response = await api.post('/logs', log);
    return response.data;
  },
};