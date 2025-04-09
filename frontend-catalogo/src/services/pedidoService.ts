import { api } from './api';
import { Pedido } from '../interfaces/Pedido';
import { DetallePedido } from '../interfaces/DetallePedido';

export const pedidoService = {
  placePedido: async (pedido: Pedido): Promise<Pedido> => {
    try {
      const { data } = await api.post('/pedidos', pedido);
      return data;
    } catch (error: any) {
      console.error('Error guardando pedido:', error.message);
      throw new Error('No se pudo guardar el pedido');
    }
  },

  placePedidoConDetalles: async (pedidoId: number, detalles: DetallePedido[]): Promise<void> => {
    try {
      await api.post(`/pedidos/${pedidoId}/detalles`, detalles);
    } catch (error: any) {
      console.error('Error guardando detalles del pedido:', error.message);
      throw new Error('No se pudieron guardar los detalles del pedido');
    }
  }
};
