import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Layout/Notification';
import { Pedido } from '../interfaces/Pedido';
import apiService from '../services/apiService';
import Layout from '../components/Layout/Layout';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Layout/Modal';
import PedidoDetalle from '../components/Pedidos/PedidoDetalle';

const Pedidos: Component = () => {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);
  const [vendedores, setVendedores] = createSignal<string[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedVendedor, setSelectedVendedor] = createSignal('');
  const [selectedEstado, setSelectedEstado] = createSignal('');
  const [filteredPedidos, setFilteredPedidos] = createSignal<Pedido[]>([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [startDate, setStartDate] = createSignal<Date | null>(null);
  const [endDate, setEndDate] = createSignal<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedPedidoId, setSelectedPedidoId] = createSignal<number | null>(null);
  const itemsPerPage = 10;

  onMount(() => {
    apiService.getPedidos()
      .then(response => {
        setPedidos(response);
        setFilteredPedidos(response);
        const uniqueVendedores = Array.from(new Set(response.map(pedido => pedido.vendedor)));
        setVendedores(uniqueVendedores);
      })
      .catch(error => {
        console.error('Error al obtener los pedidos:', error);
        showNotification('Error al obtener los pedidos', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    filterPedidos(term, startDate(), endDate(), selectedVendedor(), selectedEstado());
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    filterPedidos(searchTerm(), start, end, selectedVendedor(), selectedEstado());
  };

  const handleVendedorChange = (e: Event) => {
    const vendedor = (e.currentTarget as HTMLSelectElement).value;
    setSelectedVendedor(vendedor);
    filterPedidos(searchTerm(), startDate(), endDate(), vendedor, selectedEstado());
  };

  const handleEstadoChange = (e: Event) => {
    const estado = (e.currentTarget as HTMLSelectElement).value;
    setSelectedEstado(estado);
    filterPedidos(searchTerm(), startDate(), endDate(), selectedVendedor(), estado);
  };

  const filterPedidos = (term: string, start: Date | null, end: Date | null, vendedor: string, estado: string) => {
    const filtered = pedidos().filter(pedido => {
      const matchesTerm = pedido.cliente.toLowerCase().includes(term.toLowerCase()) ||
                          pedido.vendedor.toLowerCase().includes(term.toLowerCase());
      const matchesDate = (!start || new Date(pedido.createdAt) >= start) &&
                          (!end || new Date(pedido.createdAt) <= end);
      const matchesVendedor = !vendedor || pedido.vendedor === vendedor;
      const matchesEstado = !estado || pedido.estado === estado;
      return matchesTerm && matchesDate && matchesVendedor && matchesEstado;
    });
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

  const openModal = (pedidoId: number) => {
    setSelectedPedidoId(pedidoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPedidoId(null);
  };

  const handleEstadoChangePedido = (pedidoId: number, nuevoEstado: string) => {
    apiService.updatePedidoEstado(pedidoId, nuevoEstado)
      .then(() => {
        setPedidos(pedidos().map(pedido => 
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        ));
        showNotification('Estado del pedido actualizado', 'success');
      })
      .catch(error => {
        console.error('Error al actualizar el estado del pedido:', error);
        showNotification('Error al actualizar el estado del pedido', 'error');
      });
  };

  return (
    <Layout>
      <div>
        <h1>Pedidos</h1>
        <div class="filters-container">
          <div class="filter-group">
            <label>Buscar Pedido</label>
            <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
          </div>
          <div class="filter-group">
            <label>Filtrar por Fecha</label>
            <DatePicker startDate={startDate()} endDate={endDate()} onDateChange={handleDateChange} />
          </div>
          <div class="filter-group">
            <label>Filtrar por Vendedor</label>
            <select value={selectedVendedor()} onChange={handleVendedorChange}>
              <option value="">Todos</option>
              {vendedores().map(vendedor => (
                <option value={vendedor}>{vendedor}</option>
              ))}
            </select>
          </div>
          <div class="filter-group">
            <label>Filtrar por Estado</label>
            <select value={selectedEstado()} onChange={handleEstadoChange}>
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPedidos().map(pedido => (
              <tr onDblClick={() => openModal(pedido.id)}>
                <td>{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.vendedor}</td>
                <td>
                  <select
                    value={pedido.estado}
                    onChange={(e) => handleEstadoChangePedido(pedido.id, e.currentTarget.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => openModal(pedido.id)}>Ver Detalles</button>
                </td>
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
        <Modal isOpen={isModalOpen()} onClose={closeModal}>
          {selectedPedidoId() && <PedidoDetalle pedidoId={String(selectedPedidoId()!)} />}
        </Modal>
      </div>
    </Layout>
  );
};

export default Pedidos;