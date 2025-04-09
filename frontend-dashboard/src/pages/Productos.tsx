import { Component, createSignal, onMount } from 'solid-js';
import Modal from '../components/Layout/Modal';
import Layout from '../components/Layout/Layout';
import { productoService } from '../services/productoService';
import { Producto } from '../interfaces/Producto';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = createSignal(false);
  const [selectedProduct, setSelectedProduct] = createSignal<Producto | null>(null);
  const [activeTab, setActiveTab] = createSignal('info'); // Default tab: "info"
  const itemsPerPage = 10;

  onMount(() => {
    productoService.obtenerProductos()
      .then(setProductos)
      .catch((error) => console.error('Error al cargar los productos:', error));
  });

  const paginatedProductos = () => {
    const start = (currentPage() - 1) * itemsPerPage;
    return filteredProductos().slice(start, start + itemsPerPage);
  };

  const openDetailsModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setIsDetailsModalOpen(true);
  };

  return (
    <Layout>
      <h1>Productos</h1>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductos().map((producto) => (
            <tr key={producto.id}>
              <td>
                {producto.imagenes?.[0]?.url && (
                  <img src={producto.imagenes[0].url} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
                )}
              </td>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.categoria_id}</td>
              <td>
                <button onClick={() => openDetailsModal(producto)}>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isDetailsModalOpen()} onClose={() => setIsDetailsModalOpen(false)}>
        {selectedProduct() && (
          <div>
            <h2>Detalles del Producto</h2>
            <div class="tabs">
              <button
                class={`tab-button ${activeTab() === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Información
              </button>
              <button
                class={`tab-button ${activeTab() === 'ingresos' ? 'active' : ''}`}
                onClick={() => setActiveTab('ingresos')}
              >
                Ingresos
              </button>
              <button
                class={`tab-button ${activeTab() === 'pedidos' ? 'active' : ''}`}
                onClick={() => setActiveTab('pedidos')}
              >
                Pedidos
              </button>
            </div>
            <div class="tab-content">
              {activeTab() === 'info' && (
                <div>
                  <p><strong>Nombre:</strong> {selectedProduct().nombre}</p>
                  <p><strong>Descripción:</strong> {selectedProduct().descripcion}</p>
                  <p><strong>Precio:</strong> {selectedProduct().precio}</p>
                  <p><strong>Categoría:</strong> {selectedProduct().categoria_id}</p>
                  <p><strong>Stock:</strong> {selectedProduct().stock}</p>
                </div>
              )}
              {activeTab() === 'ingresos' && (
                <div>
                  <p>Ingresos del cliente a la web:</p>
                  <ul>
                    <li>Visita 1: Fecha y hora</li>
                    <li>Visita 2: Fecha y hora</li>
                    {/* Aquí puedes mapear los ingresos reales */}
                  </ul>
                </div>
              )}
              {activeTab() === 'pedidos' && (
                <div>
                  <p>Pedidos relacionados:</p>
                  <ul>
                    <li>Pedido 1: Detalles</li>
                    <li>Pedido 2: Detalles</li>
                    {/* Aquí puedes mapear los pedidos reales */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Productos;