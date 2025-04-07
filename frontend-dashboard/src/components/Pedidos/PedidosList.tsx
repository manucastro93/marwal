import { createSignal, onMount } from 'solid-js';
import { pedidoService } from '../../services/pedidoService';
import { Pedido } from '../../interfaces/Pedido';

const PedidosList = () => {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);

  onMount(async () => {
    const data = await pedidoService.obtenerPedidos();
    setPedidos(data);
  });

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <ul>
        {pedidos().map(pedido => (
          <li>{pedido.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default PedidosList;