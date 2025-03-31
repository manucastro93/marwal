import axios from 'axios';

const authService = {
  login: async (username: string, password: string): Promise<any> => {
    const response = await axios.post('/api/auth/login', { username, password });
    return response.data;
  },
  logout: async (): Promise<any> => {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  },
  getCurrentUser: async (): Promise<any> => {
    const response = await axios.get('/api/auth/user');
    return response.data;
  },
};

export default authService;