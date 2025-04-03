import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Pedido } from '../interfaces/Pedido';
import apiService from '../services/apiService';
import Layout from '../components/Layout';
import DatePicker from '../components/DatePicker';
import Modal from '../components/Modal';
import PedidoDetalle from '../components/PedidoDetalle';

const Pedidos: Component = () => {
  const [pedidos, setPedidos] = createSignal<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
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
      })
      .catch(error => {
        console.error('Error al obtener los pedidos:', error);
        showNotification('Error al obtener los pedidos', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    filterPedidos(term, startDate(), endDate());
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    filterPedidos(searchTerm(), start, end);
  };

  const filterPedidos = (term: string, start: Date | null, end: Date | null) => {
    const filtered = pedidos().filter(pedido => {
      const matchesTerm = pedido.cliente.toLowerCase().includes(term.toLowerCase()) ||
                          pedido.vendedor.toLowerCase().includes(term.toLowerCase());
      const matchesDate = (!start || new Date(pedido.createdAt) >= start) &&
                          (!end || new Date(pedido.createdAt) <= end);
      return matchesTerm && matchesDate;
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

  const handleEstadoChange = (pedidoId: number, nuevoEstado: string) => {
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
        <div>
          <h2>Buscar Pedido</h2>
          <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
        </div>
        <div>
          <h2>Filtrar por Fecha</h2>
          <DatePicker startDate={startDate()} endDate={endDate()} onDateChange={handleDateChange} />
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
                    onChange={(e) => handleEstadoChange(pedido.id, e.currentTarget.value)}
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