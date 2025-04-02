  export interface Imagen {
    id: number;
    producto_id: number;
    url: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    categoria_id: number;
    stock?: number;
    imagenes: Imagen[];
  }