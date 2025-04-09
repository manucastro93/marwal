
import { createSignal, onMount, For, Show } from 'solid-js';
import { pedidoService } from '../services/pedidoService';
import { Pedido } from '../interfaces/Pedido';

export default function MisPedidos() {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const data = await pedidoService.getPedidosCliente();
      setPedidos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Mis Pedidos</h1>
      <Show when={loading()} fallback={<PedidosList pedidos={pedidos()} />}>Cargando...</Show>
      <Show when={error()}>{error()}</Show>
    </div>
  );
}

function PedidosList(props: { pedidos: Pedido[] }) {
  return (
    <div class="space-y-4">
      <For each={props.pedidos}>{(pedido) => (
        <div class="border rounded-xl p-4 shadow">
          <h2 class="font-semibold text-lg">Pedido #{pedido.id}</h2>
          <p>Estado: <strong>{pedido.estado}</strong></p>
          <p>Fecha: {new Date(pedido.created_at).toLocaleDateString()}</p>
          <h3 class="mt-2 font-medium">Productos:</h3>
          <ul class="ml-4 list-disc">
            <For each={pedido.detalles}>
              {(detalle) => (
                <li>
                  {detalle.producto?.nombre} x{detalle.cantidad} - ${detalle.precio}
                </li>
              )}
            </For>
          </ul>
        </div>
      )}</For>
    </div>
  );
}
