import { BASE_URL } from '../config';
import { Cliente } from "../interfaces/Cliente";

export const saveOrUpdateCliente = async (cliente: Cliente): Promise<Cliente> => {
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

export const getClienteByIp = async (ip: string): Promise<Cliente | null> => {
  const response = await fetch(`${BASE_URL}/clientes/ip/${ip}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
};