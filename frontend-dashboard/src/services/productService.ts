import axios from 'axios';

const productService = {
  getAll: async () => {
    const response = await axios.get('/api/productos');
    return response.data;
  },
  create: async (producto) => {
    const response = await axios.post('/api/productos', producto);
    return response.data;
  },
  update: async (id, producto) => {
    const response = await axios.put(`/api/productos/${id}`, producto);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/api/productos/${id}`);
    return response.data;
  },
};

export default productService;