import { Producto } from './Producto';

export interface Pedido {
  id: number;
  cliente_id: number;
  vendedor_id: number;
  estado: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  detalles: DetallePedido[];
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  producto?: Producto;
  createdAt: string;
  updatedAt: string;
}

export interface CrearPedidoPayload {
  cliente: {
    nombre: string;
    email?: string;
    telefono?: string;
  };
  detalles: {
    producto_id: number;
    cantidad: number;
    precio: number;
  }[];
}
