import axios from 'axios';
import { Categoria } from "../interfaces/Categoria";
import { BASE_URL } from '../config';

const categoriaService = {
  getProductos: async (): Promise<Categoria[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/categorias`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categorias:", error);
      throw error;
    }
  }
};

export default categoriaService;