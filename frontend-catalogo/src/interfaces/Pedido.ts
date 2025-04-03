import { Producto } from "./Producto";

export interface Pedido {
  nombre: string;
  email: string;
  cuit: string;
  telefono: string;
  direccion: string;
  localidad: string;
  provincia: string;
  carrito: { [id: string]: { producto: Producto, cantidad: number } };
  vendedorId: string;
  ip: string;
}