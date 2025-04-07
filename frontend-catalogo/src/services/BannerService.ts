import axios from 'axios';
import { Banner } from "../interfaces/Banner";
import { BASE_URL } from '../config';

const bannerService = {
  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/pagina/banners`);
      return response.data;
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  }
};

export default bannerService;