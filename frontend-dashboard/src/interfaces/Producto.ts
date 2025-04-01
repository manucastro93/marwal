export interface Producto {
    id: number;
    nombre: string;
    categoria_id: number;
    precio: number;
    descripcion?: string;
    stock?: number;
  }