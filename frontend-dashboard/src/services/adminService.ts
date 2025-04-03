import axios from 'axios';
import { Administrador } from '../interfaces/Administrador';

const adminService = {
  getAll: async (): Promise<Administrador[]> => {
    const response = await axios.get('/api/administradores');
    return response.data;
  },
  create: async (administrador: Administrador): Promise<Administrador> => {
    const response = await axios.post('/api/administradores', administrador);
    return response.data;
  },
  update: async (id: number, administrador: Administrador): Promise<Administrador> => {
    const response = await axios.put(`/api/administradores/${id}`, administrador);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/api/administradores/${id}`);
  },
};

export default adminService;