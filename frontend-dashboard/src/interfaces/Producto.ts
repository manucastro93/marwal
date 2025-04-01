export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria_id: number;
  precio: number;
  descripcion?: string;
  stock?: number;
  imagenes?: string[]; // Array de URLs de imágenes
}