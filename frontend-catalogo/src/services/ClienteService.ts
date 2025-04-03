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

  const savedCliente = await response.json();

  if (!savedCliente.id) {
    throw new Error('Failed to save client: ID is not defined');
  }

  return savedCliente;
};