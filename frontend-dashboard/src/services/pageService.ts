import axios from 'axios';
import { Pagina } from '../interfaces/Pagina';

const pageService = {
  get: async (): Promise<Pagina> => {
    const response = await axios.get('/api/pagina');
    return response.data;
  },
  update: async (pagina: Pagina): Promise<Pagina> => {
    const response = await axios.put('/api/pagina', pagina);
    return response.data;
  },
};

export default pageService;