import axios from 'axios';
import { BASE_URL } from '../config';
import { Cliente } from "../interfaces/Cliente";

const clienterService = {
  saveOrUpdateCliente = async (cliente: Cliente): Promise<Cliente[]> => {
    try {
      const response = await axios.post(`${BASE_URL}/clientes/clientes`, cliente);
      return response.data;
    }
    catch (error) {
        console.error("Error guardar cliente:", error);
        throw error;
    }
  },
  getClienteByIp = async (ip: string): Promise<Cliente | null> => {
    try {
      const response = await axios.get(`${BASE_URL}/clientes/ip/${ip}`);
      return response.data;
    }
    catch (error) {
        console.error("Error guardar cliente:", error);
        throw error;
    }
  }
}
export default clienteService;
