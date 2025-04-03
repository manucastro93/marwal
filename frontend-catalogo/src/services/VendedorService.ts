import axios from 'axios';
import { Vendedor } from "../interfaces/Vendedor";
import { BASE_URL } from '../config';

const vendedorService = {
  getVendedorByLink: async (link: string): Promise<Vendedor[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/vendedores/by-link/${link}`);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching vendedores:", error);
      throw error;
    }
  }
};

export default vendedorService;