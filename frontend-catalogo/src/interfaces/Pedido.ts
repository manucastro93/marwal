import { Producto } from "./Producto";

export interface Pedido {
    nombre: string;
    email: string;
    cuit: string;
    telefono: string;
    carrito: Producto[];
    vendedorId: string;
    ip: string;
  }