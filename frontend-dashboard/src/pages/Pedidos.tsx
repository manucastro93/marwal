import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Pedido } from '../interfaces/Pedido';
import { apiService } from '../services/apiService';

const Pedidos: Component = () => {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredPedidos, setFilteredPedidos] = createSignal<Pedido[]>([]);

  onMount(() => {
    apiService.getPedidos()
      .then(response => {
        setPedidos(response.data);
        setFilteredPedidos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los pedidos:', error);
        showNotification('Error al obtener los pedidos', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = pedidos().filter(pedido =>
      pedido.cliente.toLowerCase().includes(term.toLowerCase()) ||
      pedido.vendedor.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPedidos(filtered);
  };

  return (
    <div>
      <h1>Pedidos</h1>
      <input
        type="text"
        placeholder="Buscar pedidos..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredPedidos().map(pedido => (
          <li>{pedido.id} - {pedido.estado}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pedidos;