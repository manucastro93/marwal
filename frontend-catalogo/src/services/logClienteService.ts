// services/logClienteService.ts
import { BASE_URL } from "../config";

export const logClienteService = {
  async crearLog(log: {
    cliente_id: number;
    accion: string;
    entidad_id?: number;
    tipo_entidad?: string;
    detalles?: string;
    ip?: string;
    user_agent?: string;
  }) {
    await fetch(`${BASE_URL}/logs-clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
  },
};
