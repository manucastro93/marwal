import { api } from './api';
import { Pedido } from '../interfaces/Pedido';

export const pedidoService = {
  obtenerPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },
  obtenerPedidoPorId: async (id: string) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },
  modificarEstadoPedido: async (id: string, estado: string) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },
  obtenerPedidosPorEstado: async (estado: string) => {
    const response = await api.get(`/pedidos/estado/${estado}`);
    return response.data;
  },
  obtenerPedidosPorRangoFechas: async (fechaInicio: string, fechaFin: string) => {
    const response = await api.post('/pedidos/rango', { fechaInicio, fechaFin });
    return response.data;
  },
};