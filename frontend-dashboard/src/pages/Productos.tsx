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
  const [sortColumn, setSortColumn] = createSignal('');
  const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('asc');
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

  const handleSaveEdit = (producto: Producto) => {
    console.log('Datos del producto a actualizar:', producto);
    productoService.actualizarProducto(producto.id, producto)
      .then((updatedProducto) => {
        const updatedProductos = productos().map(p => p.id === updatedProducto.id ? updatedProducto : p);
        setProductos(updatedProductos);
        setFilteredProductos(updatedProductos);
        showNotification('Producto actualizado con éxito', 'success');
        setEditProducto(null);
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error('Error al actualizar el producto:', error);
        showNotification(`Error al actualizar el producto - ${error.message}`, 'error');
      });
  };

  const handleDelete = (id: number) => {
    productoService.eliminarProducto(id)
      .then(() => {
        const updatedProductos = productos().filter(p => p.id !== id);
        setProductos(updatedProductos);
        setFilteredProductos(updatedProductos);
        showNotification('Producto eliminado con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
        showNotification(`Error al eliminar el producto - ${error.message}`, 'error');
      });
  };

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    filterProductos(value, selectedCategoria());
  };

  const handleCategoriaChange = (e: Event) => {
    const categoria = (e.currentTarget as HTMLSelectElement).value;
    setSelectedCategoria(categoria);
    filterProductos(searchTerm(), categoria);
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortOrder() === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
    sortProductos(column, newSortOrder);
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

  const filterProductos = (term: string, categoria: string) => {
    const filtered = productos().filter(producto => {
      const matchesTerm = producto.nombre.toLowerCase().includes(term.toLowerCase()) ||
                          (producto.descripcion && producto.descripcion.toLowerCase().includes(term.toLowerCase()));
      const matchesCategoria = !categoria || producto.categoria_id.toString() === categoria;
      return matchesTerm && matchesCategoria;
    });
    setFilteredProductos(filtered);
    setCurrentPage(1);
  };

  const totalPages = () => Math.ceil(filteredProductos().length / itemsPerPage);

  const paginatedProductos = () => {
    const start = (currentPage() - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProductos().slice(start, end);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCategoriaNombre = (categoria_id: number) => {
    const categoria = categorias().find(cat => cat.id === categoria_id);
    return categoria ? categoria.nombre : 'Desconocida';
  };

  const getSortIndicator = (column: string) => {
    if (sortColumn() === column) {
      return sortOrder() === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };
  return (
    <Layout>
      <h1>Productos</h1>
      <div class="actions">
        <button onClick={() => setIsModalOpen(true)}>Nuevo Producto</button>
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      </div>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <ProductoForm initialProducto={newProducto()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={isImportModalOpen()} onClose={() => setIsImportModalOpen(false)}>
        <h2>Confirmar Importación</h2>
        <ul>
          {productosAImportar().map((producto, index) => (
            <li key={index}>{producto.nombre} - {producto.descripcion}</li>
          ))}
        </ul>
        <button onClick={handleConfirmImport}>Confirmar</button>
      </Modal>
      {/* Tabla de productos y filtros */}
    </Layout>
  );
};

export default Productos;