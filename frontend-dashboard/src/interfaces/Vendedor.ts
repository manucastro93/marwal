export interface Vendedor {
  id?: number;
  usuario: string;
  nombre: string;
  email: string;
  telefono?: string;
  contraseña: string;
  rol: 'vendedor';
  link?: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}