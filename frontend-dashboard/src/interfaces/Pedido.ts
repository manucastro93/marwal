export interface DetallePedido {
  id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  pedido_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  vendedor_id: number;
  cliente: string;
  vendedor: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  detalles: DetallePedido[]; 
}