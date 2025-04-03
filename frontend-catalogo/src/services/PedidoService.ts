import { BASE_URL } from '../config';
import { Pedido } from "../interfaces/Pedido";
import { DetallePedido } from "../interfaces/DetallePedido"; // Importar la interfaz DetallePedido

export const placePedido = async (pedido: Pedido): Promise<Pedido> => {
  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save pedido');
  }

  return await response.json();
};

export const placePedidoConDetalles = async (pedidoId: number, detalles: DetallePedido[]): Promise<void> => {
  const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/detalles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(detalles)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save detalles del pedido');
  }
};