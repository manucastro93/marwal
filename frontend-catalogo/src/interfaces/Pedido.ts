export interface DetallePedido {
  id?: number;
  pedido_id?: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pedido {
  id?: number;
  cliente_id: number;
  vendedor_id?: number | null;
  estado?: string;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  detalles?: DetallePedido[];
}

export interface CrearPedidoPayload {
  cliente_id: number;
  vendedor_id?: number | null;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio: number;
  }[];
  ip: string;
  user_agent: string;
}
