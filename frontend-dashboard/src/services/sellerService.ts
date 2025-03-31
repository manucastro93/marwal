import axios from 'axios';
import { Vendedor } from '../interfaces/Vendedor';
import { BASE_URL } from '../config';

const sellerService = {
  getAll: async (): Promise<Vendedor[]> => {
    const response = await axios.get('/api/vendedores');
    return response.data;
  },
  create: async (vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.post('/api/vendedores', vendedor);
    return response.data;
  },
  update: async (id: number, vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.put(`/api/vendedores/${id}`, vendedor);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/api/vendedores/${id}`);
  },
};

export default sellerService;