import axios from 'axios';

const orderService = {
  getAll: async () => {
    const response = await axios.get('/api/pedidos');
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await axios.put(`/api/pedidos/${id}`, { status });
    return response.data;
  },
};

export default orderService;