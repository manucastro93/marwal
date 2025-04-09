import { api } from './apiService';
import { Pedido, DetallePedido, CrearPedidoPayload } from '../interfaces/Pedido';

export const pedidoService = {
  crearPedido: async (payload: CrearPedidoPayload): Promise<Pedido> => {
    try {
      const { data } = await api.post('/pedidos/crear', payload);
      return data;
    } catch (error: any) {
      console.error('Error al crear el pedido completo:', error.message);
      throw new Error('No se pudo crear el pedido completo');
    }
  }
};
