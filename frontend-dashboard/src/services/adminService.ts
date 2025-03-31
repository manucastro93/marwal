import axios from 'axios';

const adminService = {
  getAll: async () => {
    const response = await axios.get('/api/administradores');
    return response.data;
  },
  create: async (administrador) => {
    const response = await axios.post('/api/administradores', administrador);
    return response.data;
  },
  update: async (id, administrador) => {
    const response = await axios.put(`/api/administradores/${id