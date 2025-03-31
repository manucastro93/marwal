import axios from 'axios';

const categoryService = {
  getAll: async () => {
    const response = await axios.get('/api/categorias');
    return response.data;
  },
  create: async (categoria) => {
    const response = await axios.post('/api/categorias', categoria);
    return response.data;
  },
  update: async (id, categoria) => {
    const response = await axios.put(`/api/categorias/${id}`, categoria);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/api/categorias/${id}`);
    return response.data;
  },
};

export default categoryService;