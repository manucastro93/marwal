import { Component, createSignal, onMount } from 'solid-js';
import * as XLSX from 'xlsx';
import { showNotification } from '../components/Layout/Notification';
import { Producto } from '../interfaces/Producto';
import { Categoria } from '../interfaces/Categoria';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import Layout from '../components/Layout/Layout';
import Modal from '../components/Layout/Modal';
import ProductoForm from '../components/Productos/ProductoForm';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const [productosAImportar, setProductosAImportar] = createSignal<Producto[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = createSignal(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = createSignal(false);
  const [selectedProduct, setSelectedProduct] = createSignal<Producto | null>(null);
  const [activeTab, setActiveTab] = createSignal('details'); // Default tab: "details"
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const itemsPerPage = 10;

  onMount(() => {
    productoService.obtenerProductos()
      .then((productos) => {
        setProductos(productos);
        setFilteredProductos(productos);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        showNotification('Error al obtener los productos', 'error');
      });

    categoriaService.obtenerCategorias()
      .then((categorias) => {
        setCategorias(categorias);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        showNotification('Error al obtener las categorías', 'error');
      });
  });

  const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const productos: Producto[] = XLSX.utils.sheet_to_json(sheet);
      setProductosAImportar(productos);
      setIsImportModalOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    try {
      await productoService.importarProductos(productosAImportar());
      showNotification('Productos importados con éxito', 'success');
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Error al importar productos:', error);
      showNotification('Error al importar productos', 'error');
    }
  };

  const openDetailsModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setIsDetailsModalOpen(true);
  };

  return (
    <Layout>
      <h1>Productos</h1>
      <div class="actions">
        <button class="btn btn-primary" onClick={() => setIsModalOpen(true)}>Nuevo Producto</button>
        <label class="btn btn-secondary">
          <span>📂 Importar Excel</span>
          <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
      </div>
      <Modal isOpen={isImportModalOpen()} onClose={() => setIsImportModalOpen(false)}>
        <h2>Confirmar Importación</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {productosAImportar().map((producto, index) => (
              <tr key={index}>
                <td><input type="text" value={producto.nombre} /></td>
                <td><input type="text" value={producto.descripcion} /></td>
                <td><input type="number" value={producto.precio} /></td>
                <td><input type="text" value={producto.categoria_id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button class="btn btn-success" onClick={handleConfirmImport}>Confirmar</button>
      </Modal>
      <Modal isOpen={isDetailsModalOpen()} onClose={() => setIsDetailsModalOpen(false)}>
        {selectedProduct() && (
          <div>
            <h2>Detalles del Producto</h2>
            <div class="tabs">
              <button
                class={`tab-button ${activeTab() === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Detalles
              </button>
              <button
                class={`tab-button ${activeTab() === 'imagenes' ? 'active' : ''}`}
                onClick={() => setActiveTab('imagenes')}
              >
                Imágenes
              </button>
              <button
                class={`tab-button ${activeTab() === 'ventas' ? 'active' : ''}`}
                onClick={() => setActiveTab('ventas')}
              >
                Ventas Relacionadas
              </button>
            </div>
            <div class="tab-content">
              {activeTab() === 'details' && (
                <div>
                  <p><strong>Nombre:</strong> {selectedProduct().nombre}</p>
                  <p><strong>Descripción:</strong> {selectedProduct().descripcion}</p>
                  <p><strong>Precio:</strong> {selectedProduct().precio}</p>
                  <p><strong>Categoría:</strong> {selectedProduct().categoria_id}</p>
                  <p><strong>Stock:</strong> {selectedProduct().stock}</p>
                </div>
              )}
              {activeTab() === 'imagenes' && (
                <div>
                  <h3>Imágenes del Producto</h3>
                  {selectedProduct().imagenes?.map((imagen, index) => (
                    <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} width="100" />
                  ))}
                </div>
              )}
              {activeTab() === 'ventas' && (
                <div>
                  <h3>Ventas Relacionadas</h3>
                  <ul>
                    <li>Venta 1: Detalles</li>
                    <li>Venta 2: Detalles</li>
                    {/* Aquí puedes mapear las ventas reales */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      <table class="table">
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
          {productos().map((producto) => (
            <tr key={producto.id}>
              <td>
                {producto.imagenes?.[0]?.url && (
                  <img src={producto.imagenes[0].url} alt={producto.nombre} width="50" />
                )}
              </td>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.categoria_id}</td>
              <td>
                <button class="btn btn-info btn-sm" onClick={() => openDetailsModal(producto)}>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Productos;