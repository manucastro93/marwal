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
  const [editProducto, setEditProducto] = createSignal<Producto | null>(null);
  const [newProducto] = createSignal<Producto>({ id: 0, codigo: '', nombre: '', descripcion: '', precio: 0, categoria_id: 0, stock: 0, imagenes: [] });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedCategoria, setSelectedCategoria] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);
  const [sortColumn, setSortColumn] = createSignal('codigo'); // Orden inicial por "codigo"
  const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('asc'); // Orden ascendente por defecto
  const itemsPerPage = 10;

  onMount(() => {
    productoService.obtenerProductos()
      .then((productos) => {
        setProductos(productos);
        setFilteredProductos(productos);
        sortProductos(sortColumn(), sortOrder());
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

  const handleTableInputChange = (index: number, key: keyof Producto, value: any) => {
    const updatedProductos = [...productosAImportar()];
    updatedProductos[index][key] = value;
    setProductosAImportar(updatedProductos);
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

  const handleSaveNew = (producto: Producto) => {
    productoService.crearProducto(producto)
      .then((newProducto) => {
        const updatedProductos = [...productos(), newProducto];
        setProductos(updatedProductos);
        setFilteredProductos(updatedProductos);
        showNotification('Producto creado con éxito', 'success');
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
        showNotification(`Error al crear el producto - ${error.message}`, 'error');
      });
  };

  const sortProductos = (column: string, order: 'asc' | 'desc') => {
    const sorted = [...filteredProductos()].sort((a, b) => {
      const valueA = a[column as keyof Producto];
      const valueB = b[column as keyof Producto];

      if (valueA === undefined || valueB === undefined) return 0;

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredProductos(sorted);
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
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <ProductoForm initialProducto={newProducto()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={isImportModalOpen()} onClose={() => setIsImportModalOpen(false)}>
        <h2>Productos a importar</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productosAImportar().map((producto, index) => (
              <tr>
                <td><input value={producto.codigo} onInput={(e) => handleTableInputChange(index, 'codigo', (e.target as HTMLInputElement).value)} /></td>
                <td><input value={producto.nombre} onInput={(e) => handleTableInputChange(index, 'nombre', (e.target as HTMLInputElement).value)} /></td>
                <td><input value={producto.descripcion} onInput={(e) => handleTableInputChange(index, 'descripcion', (e.target as HTMLInputElement).value)} /></td>
                <td><input value={producto.precio} type="number" onInput={(e) => handleTableInputChange(index, 'precio', Number((e.target as HTMLInputElement).value))} /></td>
                <td><input value={producto.categoria_id} type="number" onInput={(e) => handleTableInputChange(index, 'categoria_id', Number((e.target as HTMLInputElement).value))} /></td>
                <td><input value={producto.stock} type="number" onInput={(e) => handleTableInputChange(index, 'stock', Number((e.target as HTMLInputElement).value))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button class="btn btn-success" onClick={handleConfirmImport}>Confirmar Importación</button>
      </Modal>
      {/* Tabla de productos y filtros */}
    </Layout>
  );
};

export default Productos;