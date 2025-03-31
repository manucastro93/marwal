import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Pedidos: Component = () => {
  const [pedidos, setPedidos] = createSignal([]);

  onMount(() => {
    axios.get('/api/pedidos')
      .then(response => setPedidos(response.data))
      .catch(error => console.error('Error al obtener los pedidos:', error));
  });

  return (
    <div>
      <h1>Pedidos</h1>
      <ul>
        {pedidos().map(pedido => (
          <li>{pedido.id} - {pedido.estado}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pedidos;