export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria_id: number;
  stock?: number;
  imagenes?: string[];
  updatedAt?: string;
}