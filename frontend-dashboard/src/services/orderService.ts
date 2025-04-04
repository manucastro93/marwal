import axios from 'axios';
import { BASE_URL_API } from '../config';
import { Pedido } from '../interfaces/Pedido';

const orderService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos`);
    return response.data;
  },
  updateStatus: async (id: number, status: string): Promise<Pedido> => {
    const response = await axios.put(`${BASE_URL_API}/pedidos/${id}`, { status });
    return response.data;
  },
  getOrdersByStatus: async (status: string): Promise<Pedido[]> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos/estado/${status}`);
    return response.data;
  },
  getTotalOrdersThisMonth: async (): Promise<number> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/total-this-month`);
    return response.data.total;
  },
  getMonthlyMetrics: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/monthly`);
    return response.data;
  },
  getAnnualMetrics: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/annual`);
    return response.data;
  },
  compareOrdersByDateRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/pedidos/metrics/comparar`, {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getProductMetrics: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/productos/metricas`);
    return response.data;
  },
  getCustomerMetrics: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/clientes/metricas`);
    return response.data;
  },
  getSellerMetrics: async (): Promise<any> => {
    const response = await axios.get(`${BASE_URL_API}/vendedores/metricas`);
    return response.data;
  },
};

export default orderService;