export interface Usuario {
    id?: number;
    usuario: string;
    nombre: string;
    email: string;
    contraseña: string;
    rol: 'administrador' | 'supremo' | 'vendedor';
    estado: string;
    createdAt: Date;
    updatedAt: Date;
  }