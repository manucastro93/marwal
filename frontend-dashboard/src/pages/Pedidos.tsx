import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Pedido } from '../interfaces/Pedido';
import apiService from '../services/apiService';
import Layout from '../components/Layout';

const Pedidos: Component = () => {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredPedidos, setFilteredPedidos] = createSignal<Pedido[]>([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  onMount(() => {
    apiService.getPedidos()
      .then(response => {
        setPedidos(response); // Corrige aquí
        setFilteredPedidos(response); // Corrige aquí
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
    setCurrentPage(1);
  };

  const totalPages = () => Math.ceil(filteredPedidos().length / itemsPerPage);

  const paginatedPedidos = () => {
    const start = (currentPage() - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPedidos().slice(start, end);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div>
        <h1>Pedidos</h1>
        <div>
          <h2>Buscar Pedido</h2>
          <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPedidos().map(pedido => (
              <tr>
                <td>{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.vendedor}</td>
                <td>{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="pagination">
          {Array.from({ length: totalPages() }, (_, index) => (
            <button onClick={() => handlePageChange(index + 1)} disabled={currentPage() === index + 1}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pedidos;