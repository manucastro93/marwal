import { BASE_URL } from '../config';
import { Pedido } from "../interfaces/Pedido";
import { DetallePedido } from "../interfaces/DetallePedido"; // Importar la interfaz DetallePedido

export const placePedidoConDetalles = async (pedido: Pedido, detalles: DetallePedido[]): Promise<Pedido> => {
  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...pedido, detalles })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save pedido');
  }

  return await response.json();
};