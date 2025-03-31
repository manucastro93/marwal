import axios from 'axios';
import { Pedido } from '../interfaces/Pedido';
import { BASE_URL } from '../config';

const orderService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await axios.get('/api/pedidos');
    return response.data;
  },
  updateStatus: async (id: number, status: string): Promise<Pedido> => {
    const response = await axios.put(`/api/pedidos/${id}`, { status });
    return response.data;
  },
};

export default orderService;