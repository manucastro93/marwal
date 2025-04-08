import axios from 'axios';

const API_URL = 'https://catalogo-online-marwal.onrender.com/api';
const token = localStorage.getItem('token');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json' // Configuración por defecto
  },
  withCredentials: true,
});


export const API_URL_API = 'https://catalogo-online-marwal.onrender.com/api';