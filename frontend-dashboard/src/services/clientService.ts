import axios from 'axios';

const clientService = {
  getAll: async () => {
    const response = await axios.get('/api/clientes');
    return response.data;
  },
};

export default clientService;