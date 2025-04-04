import axios from 'axios';
import { BASE_URL_API } from '../config';

export const getMonthlyMetrics = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/monthly`);
    console.log("response: ", response)
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly metrics:", error);
    throw error;
  }
};

export const getAnnualMetrics = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/annual`);
    return response.data;
  } catch (error) {
    console.error("Error fetching annual metrics:", error);
    throw error;
  }
};

export const compareOrdersByDateRange = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/comparar`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error comparing orders by date range:", error);
    throw error;
  }
};