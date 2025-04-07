import { api } from './api';
import { Notificacion } from '../interfaces/Notificacion';

export const notificacionService = {
  obtenerNotificaciones: async () => {
    const response = await api.get('/notificaciones');
    return response.data;
  },
  crearNotificacion: async (notificacion: Notificacion) => {
    const response = await api.post('/notificaciones', notificacion);
    return response.data;
  },
  marcarNotificacionLeida: async (id: string) => {
    const response = await api.put(`/notificaciones/${id}/leida`);
    return response.data;
  },
};