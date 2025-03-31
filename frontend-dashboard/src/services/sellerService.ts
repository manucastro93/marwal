import axios from 'axios';

const pageService = {
  get: async () => {
    const response = await axios.get('/api/pagina');
    return response.data;
  },
  update: async (pagina) => {
    const response = await axios.put('/api/pagina', pagina);
    return response.data;
  },
};

export default pageService;