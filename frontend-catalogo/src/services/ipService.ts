import { BASE_URL } from "../config";

export const ipService = {
  async registrarIP(clienteId: number, ip: string) {
    await fetch(`${BASE_URL}/ips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente_id: clienteId, ip }),
    });
  },
};
