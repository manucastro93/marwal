import axios from 'axios';
import { Producto } from "../interfaces/Producto";
import { BASE_URL } from '../config';

const productoService = {
  getProductos: async (): Promise<Producto[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/productos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching productos:", error);
      throw error;
    }
  }
};

export default productoService;