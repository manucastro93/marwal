import axios from 'axios';
import { BASE_URL_API } from '../config';
import { Producto } from '../interfaces/Producto';
import { Cliente } from '../interfaces/Cliente';
import { Administrador } from '../interfaces/Administrador';
import { Categoria } from '../interfaces/Categoria';
import { Pedido } from '../interfaces/Pedido';
import { Vendedor } from '../interfaces/Vendedor';
import { Banner } from '../interfaces/Pagina';
import { Logo } from '../interfaces/Pagina';

const apiService = {
  // Productos
  getProductos: async (): Promise<Producto[]> => {
    const response = await axios.get(`${BASE_URL_API}/productos`);
    return response.data;
  },
  createProducto: async (producto: Producto): Promise<Producto> => {
    try {
      const response = await axios.post(`${BASE_URL_API}/productos`, producto);
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
      const response = await axios.put(`${BASE_URL_API}/productos/${id}`, producto);
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
    await axios.delete(`${BASE_URL_API}/productos/${id}`);
  },
  uploadImage: async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await axios.post(`${BASE_URL_API}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url; // URL de la imagen subida
  },

  // Categorías
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axios.get(`${BASE_URL_API}/categorias`);
    return response.data;
  },
  createCategoria: async (categoria: Categoria): Promise<Categoria> => {
    const response = await axios.post(`${BASE_URL_API}/categorias`, categoria);
    return response.data;
  },
  updateCategoria: async (id: number, categoria: Categoria): Promise<Categoria> => {
    const response = await axios.put(`${BASE_URL_API}/categorias/${id}`, categoria);
    return response.data;
  },
  deleteCategoria: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL_API}/categorias/${id}`);
  },

  // Vendedores
  getVendedores: async (): Promise<Vendedor[]> => {
    try {
      const response = await axios.get(`${BASE_URL_API}/vendedores`);
      return response.data;
    } catch (error) {
      console.error('Error en getVendedores:', error);
      throw error;
    }
  },
  createVendedor: async (vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.post(`${BASE_URL_API}/vendedores`, vendedor);
    return response.data;
  },
  updateVendedor: async (id: number, vendedor: Vendedor): Promise<Vendedor> => {
    const response = await axios.put(`${BASE_URL_API}/vendedores/${id}`, vendedor);
    return response.data;
  },
  deleteVendedor: async (id: number): Promise<void> => {
    await axios.put(`${BASE_URL_API}/vendedores/${id}/eliminar`);
  },

  // Administradores
  getAdministradores: async (): Promise<Administrador[]> => {
    const response = await axios.get(`${BASE_URL_API}/administradores`);
    return response.data;
  },
  createAdministrador: async (administrador: Administrador): Promise<Administrador> => {
    const response = await axios.post(`${BASE_URL_API}/administradores`, administrador);
    return response.data;
  },
  updateAdministrador: async (id: number, administrador: Administrador): Promise<Administrador> => {
    const response = await axios.put(`${BASE_URL_API}/administradores/${id}`, administrador);
    return response.data;
  },
  deleteAdministrador: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL_API}/administradores/${id}`);
  },

  // Clientes
  getClientes: async (): Promise<Cliente[]> => {
    const response = await axios.get(`${BASE_URL_API}/clientes`);
    return response.data;
  },
  updateCliente: async (id: number, cliente: Cliente): Promise<Cliente> => {
    const response = await axios.put(`${BASE_URL_API}/clientes/${id}`, cliente);
    return response.data;
  },

  // Pedidos
  getPedidos: async (): Promise<Pedido[]> => {
    const response = await axios.get<Pedido[]>(`${BASE_URL_API}/pedidos`);
    const pedidos = response.data; 

    // Obtener los nombres de clientes y vendedores
    for (const pedido of pedidos) {
      const clienteResponse = await axios.get(`${BASE_URL_API}/clientes/${pedido.cliente_id}`);
      pedido.cliente = clienteResponse.data.nombre;

      const vendedorResponse = await axios.get(`${BASE_URL_API}/vendedores/${pedido.vendedor_id}`);
      pedido.vendedor = vendedorResponse.data.nombre;
    }

    return pedidos;
  },
  getPedidoById: async (id: number): Promise<Pedido> => {
    const response = await axios.get<Pedido>(`${BASE_URL_API}/pedidos/${id}`);
    const pedido = response.data;

    // Obtener los nombres de cliente y vendedor
    const clienteId = pedido.cliente_id;
    const vendedorId = pedido.vendedor_id;

    const clienteResponse = await axios.get(`${BASE_URL_API}/clientes/${clienteId}`);
    pedido.cliente = clienteResponse.data.nombre;

    const vendedorResponse = await axios.get(`${BASE_URL_API}/vendedores/${vendedorId}`);
    pedido.vendedor = vendedorResponse.data.nombre;

    return pedido;
  },
  updatePedidoEstado: async (id: number, estado: string): Promise<void> => {
    await axios.put(`${BASE_URL_API}/pedidos/${id}`, { estado });
  },

  // Página
  getBanners: async (): Promise<Banner[]> => {
    const response = await axios.get(`${BASE_URL_API}/pagina/banners`);
    return response.data;
  },
  createBanner: async (banner: FormData): Promise<Banner> => {
    const response = await axios.post(`${BASE_URL_API}/pagina/banners`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updateBanner: async (id: number, banner: FormData): Promise<Banner> => {
    const response = await axios.put(`${BASE_URL_API}/pagina/banners/${id}`, banner, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteBanner: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL_API}/pagina/banners/${id}`);
  },
  getLogo: async (): Promise<Logo> => {
    const response = await axios.get(`${BASE_URL_API}/pagina/logo`);
    return response.data;
  },
  createOrUpdateLogo: async (logo: FormData): Promise<Logo> => {
    const response = await axios.post(`${BASE_URL_API}/pagina/logo`, logo, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default apiService;