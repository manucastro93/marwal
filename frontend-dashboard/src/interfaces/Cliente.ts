export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  cuit_cuil: string;
  dirección: string;
  localidad: string;
  provincia: string;
  ip?: string;
  vendedor_id?: number;
  createdAt: Date;
  updatedAt: Date;
  vendedor?: {
    id: number;
    nombre: string;
  };
}