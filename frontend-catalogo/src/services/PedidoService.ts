//import axios from 'axios';
import { BASE_URL } from '../config';
import { Pedido } from "../interfaces/Pedido";

export const placePedido = async (pedido: Pedido): Promise<void> => {
  await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  });
};