import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  },
  withCredentials: true,
});

export const API_URL_API = 'http://localhost:3000/api';