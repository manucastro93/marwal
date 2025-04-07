export interface Pedido {
  id?: number;
  cliente_id: number;
  vendedor_id: number;
  estado?: 'Pendiente' | 'En Proceso' | 'Finalizado' | 'Rechazado';
  createdAt?: string;
  updated_at?: string;
}