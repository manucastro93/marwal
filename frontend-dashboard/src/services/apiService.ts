import axios from 'axios';
import { BASE_URL } from '../config';
import { Producto } from '../interfaces/Producto';
import { Cliente } from '../interfaces/Cliente';
import { Administrador } from '../interfaces/Administrador';
import { Categoria } from '../interfaces/Categoria';
import { Pedido } from '../interfaces/Pedido';
import { Vendedor } from '../interfaces/Vendedor';
import { Pagina } from '../interfaces/Pagina';

const apiService = {
  // Productos
  getProductos: async (): Promise<Producto[]> => {
    const response = await axios.get(`${BASE_URL}/productos`);
    return response.data;
  },
  createProducto: async (producto: Producto): Promise<Producto> => {
    try {
      const response = await axios.post(`${BASE_URL}/productos`, producto);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Error al crear el producto');
      }
    }
  },
  updateProducto: async (id: number, producto: Producto): Promise<Producto> => {
    try {
      const response = await axios.put(`${BASE_URL}/productos/${id}`, producto);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Error al actualizar el producto');
      }
    }
  },
  deleteProducto: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/productos/${id}`);
  },
  uploadImage: async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await axios.post(`${BASE_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url; // URL de la imagen subida
  },

  // Categorías
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axios.get(`${BASE_URL}/categorias`);
    return response.data;
  },
  createCategoria: async (categoria: Categoria): Promise<Categoria> => {
    const response = await axios.post(`${BASE_URL}/categorias`, categoria);
    return response.data;
  },
  updateCategoria: async (id: number, categoria: Categoria): Promise<Categoria> => {
    const response = await axios.put(`${BASE_URL}/categorias/${id}`, categoria);
    return response.data;
  },
  deleteCategoria: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/categorias/${id}`);
  },

  // Vendedores
  getVendedores: async (): Promise<Vendedor[]> => {
    const response = await axios.get(`${BASE_URL}/vendedores`);
    return response.data;
  },
  createVendedor: async (vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.post(`${BASE_URL}/vendedores`, vendedor);
    return response.data;
  },
  updateVendedor: async (id: number, vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.put(`${BASE_URL}/vendedores/${id}`, vendedor);
    return response.data;
  },
  deleteVendedor: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/vendedores/${id}`);
  },

  // Administradores
  getAdministradores: async (): Promise<Administrador[]> => {
    const response = await axios.get(`${BASE_URL}/administradores`);
    return response.data;
  },
  createAdministrador: async (administrador: Administrador): Promise<Administrador> => {
    const response = await axios.post(`${BASE_URL}/administradores`, administrador);
    return response.data;
  },
  updateAdministrador: async (id: number, administrador: Administrador): Promise<Administrador> => {
    const response = await axios.put(`${BASE_URL}/administradores/${id}`, administrador);
    return response.data;
  },
  deleteAdministrador: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/administradores/${id}`);
  },

  // Clientes
  getClientes: async (): Promise<Cliente[]> => {
    const response = await axios.get(`${BASE_URL}/clientes`);
    console.log('Clientes:', response.data);
    return response.data;
  },
  updateCliente: async (id: number, cliente: Cliente): Promise<Cliente> => {
    const response = await axios.put(`${BASE_URL}/clientes/${id}`, cliente);
    return response.data;
  },

  // Pedidos
  getPedidos: async (): Promise<Pedido[]> => {
    const response = await axios.get(`${BASE_URL}/pedidos`);
    return response.data;
  },

  // Página
  getPagina: async (): Promise<Pagina> => {
    const response = await axios.get(`${BASE_URL}/pagina`);
    return response.data;
  },
  updatePagina: async (pagina: Pagina): Promise<Pagina> => {
    const response = await axios.put(`${BASE_URL}/pagina`, pagina);
    return response.data;
  }
};

export default apiService;