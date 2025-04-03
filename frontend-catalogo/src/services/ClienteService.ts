import { BASE_URL } from '../config';
import { Cliente } from "../interfaces/Cliente";

export const saveCliente = async (cliente: Cliente): Promise<Cliente> => {
  const response = await fetch(`${BASE_URL}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save client');
  }

  return await response.json();
};