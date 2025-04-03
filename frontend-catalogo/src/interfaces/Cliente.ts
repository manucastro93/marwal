export interface Cliente {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    cuit_cuil: string;
    dirección: string;
    localidad: string;
    provincia: string;
    ip?: string;
    vendedor_id?: number | null;
    createdAt?: string;
    updatedAt?: string;
  }