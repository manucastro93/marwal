import { api, API_URL_API } from './api';
import axios from 'axios';
import { Usuario } from '../interfaces/Usuario';
/*  obtenerUsuarioConectado: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await axios.get(`${API_URL_API}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true // Permitir que las cookies se envíen con las solicitudes
      });
      return response.data; // Aquí debe devolver los datos del usuario actual
    } catch (error) {
      console.error('Error al obtener el usuario conectado:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  } */


export const usuarioService = {
  obtenerUsuarioConectado: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL_API}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true // Permitir que las cookies se envíen con las solicitudes
      });
      return response.data; // Aquí debe devolver los datos del usuario actual
    } catch (error) {
      console.error('Error al obtener el usuario conectado:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  },
  obtenerUsuarios: async (page: number, limit: number, search: string, role: string) => {
    const response = await api.get(`/usuarios?page=${page}&limit=${limit}&search=${search}&role=${role}`);
    return response.data;
  },
  obtenerUsuarioPorId: async (id: string) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  crearUsuario: async (usuario: Usuario) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL_API}/usuarios`, usuario, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log('Respuesta de la creación de usuario:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        if (errorData?.errors) {
          throw errorData.errors;
        } else if (errorData?.message) {
          throw { message: errorData.message };
        }
      }
      throw { message: 'Error de conexión' };
    }
  },
  actualizarUsuario: async (id: string, usuario: Usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },
  eliminarUsuario: async (id: string) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};