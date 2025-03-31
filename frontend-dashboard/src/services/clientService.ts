import axios from 'axios';
import { Cliente } from '../interfaces/Cliente';
import { BASE_URL } from '../config';

const clientService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await axios.get('/api/clientes');
    return response.data;
  },
};

export default clientService;