import axios from 'axios';
import { Producto } from '../interfaces/Producto';
import { Cliente } from '../interfaces/Cliente';
import { Administrador } from '../interfaces/Administrador';
import { Categoria } from '../interfaces/Categoria';
import { Pedido } from '../interfaces/Pedido';
import { Vendedor } from '../interfaces/Vendedor';
import { Pagina } from '../interfaces/Pagina';

export const apiService = {
  getProductos: () => axios.get<Producto[]>('/api/productos'),
  getClientes: () => axios.get<Cliente[]>('/api/clientes'),
  getAdministradores: () => axios.get<Administrador[]>('/api/administradores'),
  getCategorias: () => axios.get<Categoria[]>('/api/categorias'),
  getPedidos: () => axios.get<Pedido[]>('/api/pedidos'),
  getVendedores: () => axios.get<Vendedor[]>('/api/vendedores'),
  getPagina: () => axios.get<Pagina>('/api/pagina'),
};