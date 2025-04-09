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
import ProductoDetalle from '../components/Productos/ProductoDetalle';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const [editProducto, setEditProducto] = createSignal<Producto | null>(null);
  const [newProducto] = createSignal<Producto>({ id: 0, codigo: '', nombre: '', descripcion: '', precio: 0, categoria_id: 0, stock: 0, imagenes: [] });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedCategoria, setSelectedCategoria] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);
  const [isImportModalOpen, setIsImportModalOpen] = createSignal(false);
  const [importedProductos, setImportedProductos] = createSignal<Producto[]>([]);
  const [selectedProducto, setSelectedProducto] = createSignal<Producto | null>(null);
  const [isDetalleModalOpen, setIsDetalleModalOpen] = createSignal(false);
  const [sortColumn, setSortColumn] = createSignal('');
  const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('asc');
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = createSignal(false);
  const [productoToDelete, setProductoToDelete] = createSignal<Producto | null>(null);
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
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
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

  const handleExcelImport = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<any>(worksheet);

    const productosExcel: Producto[] = json.map(row => ({
      id: 0,
      codigo: row.codigo ?? '',
      nombre: row.nombre ?? '',
      descripcion: row.descripcion ?? '',
      precio: parseFloat(row.precio ?? 0),
      stock: parseInt(row.stock ?? 0),
      categoria_id: parseInt(row.categoria_id ?? 0),
      imagenes: [],
    }));

    setImportedProductos(productosExcel);
    setIsImportModalOpen(true);
  };

  const handleConfirmImport = () => {
    Promise.all(importedProductos().map(p => productoService.crearProducto(p)))
      .then((nuevos) => {
        const updated = [...productos(), ...nuevos];
        setProductos(updated);
        setFilteredProductos(updated);
        showNotification('Productos importados con éxito', 'success');
        setIsImportModalOpen(false);
      })
      .catch((error) => {
        console.error('Error en la importación:', error);
        showNotification(`Error al importar productos - ${error.message}`, 'error');
      });
  };

  return (
    <Layout>
      <h1>Productos</h1>

      <input
        type="file"
        accept=".xlsx"
        id="excel-input"
        style={{ display: 'none' }}
        onChange={handleExcelImport}
      />
      <button onClick={() => document.getElementById('excel-input')?.click()}>
        Importar desde Excel
      </button>
      <button onClick={() => setIsModalOpen(true)}>Nuevo Producto</button>

      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <ProductoForm initialProducto={newProducto()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
        {editProducto() && (
          <ProductoForm initialProducto={editProducto()!} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
        )}
      </Modal>

      <Modal isOpen={isDetalleModalOpen()} onClose={() => setIsDetalleModalOpen(false)}>
        {selectedProducto() && (
          <ProductoDetalle producto={selectedProducto()!} categorias={categorias()} onClose={() => setIsDetalleModalOpen(false)} />
        )}
      </Modal>
      <Modal isOpen={isConfirmDeleteModalOpen()} onClose={() => setIsConfirmDeleteModalOpen(false)}>
        <div style={{ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "padding": "1rem" }}>
          <div style={{ "font-size": "3rem", "color": "#dc3545", "margin-bottom": "0.5rem" }}>⚠️</div>
          <h3 style={{ "margin-bottom": "0.5rem" }}>¿Eliminar producto?</h3>
          <p style={{ "margin-bottom": "1rem" }}>
            ¿Estás seguro de que deseas eliminar el producto <strong>{productoToDelete()?.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div style={{ "display": "flex", "gap": "0.5rem" }}>
            <button
              class="btn btn-secondary"
              onClick={() => setIsConfirmDeleteModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              class="btn btn-danger"
              onClick={() => {
                if (productoToDelete()) {
                  handleDelete(productoToDelete()!.id);
                  setIsConfirmDeleteModalOpen(false);
                  setProductoToDelete(null);
                }
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>


      <Modal isOpen={isImportModalOpen()} onClose={() => setIsImportModalOpen(false)}>
  <div style={{ "max-height": "80vh", "overflow": "hidden", "display": "flex", "flex-direction": "column" }}>
    <h3 style={{ "margin-bottom": "1rem", "text-align": "center" }}>Vista previa de productos importados (editable)</h3>
    
    <div style={{ "overflow-y": "auto", "flex-grow": 1 }}>
      <table style={{ "width": "100%", "border-collapse": "collapse" }}>
        <thead>
          <tr>
            <th style={cellHeaderStyle}>Código</th>
            <th style={cellHeaderStyle}>Nombre</th>
            <th style={cellHeaderStyle}>Descripción</th>
            <th style={cellHeaderStyle}>Precio</th>
            <th style={cellHeaderStyle}>Stock</th>
            <th style={cellHeaderStyle}>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {importedProductos().map((producto, index) => (
            <tr>
              <td style={cellStyle}>
                <input type="text" value={producto.codigo} onInput={(e) => updateImportedProducto(index, 'codigo', e.currentTarget.value)} />
              </td>
              <td style={cellStyle}>
                <input type="text" value={producto.nombre} onInput={(e) => updateImportedProducto(index, 'nombre', e.currentTarget.value)} />
              </td>
              <td style={cellStyle}>
                <input type="text" value={producto.descripcion} onInput={(e) => updateImportedProducto(index, 'descripcion', e.currentTarget.value)} />
              </td>
              <td style={cellStyle}>
                <input type="number" value={producto.precio} onInput={(e) => updateImportedProducto(index, 'precio', parseFloat(e.currentTarget.value))} />
              </td>
              <td style={cellStyle}>
                <input type="number" value={producto.stock} onInput={(e) => updateImportedProducto(index, 'stock', parseInt(e.currentTarget.value))} />
              </td>
              <td style={cellStyle}>
                <select value={producto.categoria_id} onChange={(e) => updateImportedProducto(index, 'categoria_id', parseInt(e.currentTarget.value))}>
                  {categorias().map(categoria => (
                    <option value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ "margin-top": "1rem", "text-align": "center" }}>
      <button onClick={handleConfirmImport}>Confirmar Importación</button>
    </div>
  </div>
</Modal>



      <div class="filters-container">
        <div class="filter-group">
          <label>Buscar Producto</label>
          <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
        </div>
        <div class="filter-group">
          <label>Filtrar por Categoría</label>
          <select value={selectedCategoria()} onChange={handleCategoriaChange}>
            <option value="">Todas</option>
            {categorias().map(categoria => (
              <option value={categoria.id.toString()}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th onClick={() => handleSort('codigo')}>Código {getSortIndicator('codigo')}</th>
            <th onClick={() => handleSort('nombre')}>Nombre {getSortIndicator('nombre')}</th>
            <th onClick={() => handleSort('precio')}>Precio {getSortIndicator('precio')}</th>
            <th onClick={() => handleSort('categoria_id')}>Categoría {getSortIndicator('categoria_id')}</th>
            <th onClick={() => handleSort('descripcion')}>Descripción {getSortIndicator('descripcion')}</th>
            <th onClick={() => handleSort('stock')}>Stock {getSortIndicator('stock')}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductos().map(producto => (
            <tr>
              <td>
                {producto.imagenes && producto.imagenes.length > 0 && (
                  <img src={producto.imagenes[0].url} alt="Imagen principal" width="80" />
                )}
              </td>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{getCategoriaNombre(producto.categoria_id)}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.stock}</td>
              <td>
                <button class="btn btn-info btn-sm" onClick={() => { setSelectedProducto(producto); setIsDetalleModalOpen(true); }}>Ver detalles</button>
                <button class="btn btn-warning btn-sm" onClick={() => { setEditProducto(producto); setIsEditModalOpen(true); }}>Editar</button>
                <button class="btn btn-danger btn-sm right" onClick={() => { setProductoToDelete(producto); setIsConfirmDeleteModalOpen(true); }}>
                  Eliminar
                </button>
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
    </Layout>
  );
};
const cellStyle = { "border": "1px solid #eee", "padding": "4px" };
const cellHeaderStyle = { "border": "1px solid #ccc", "padding": "8px", "background-color": "#f0f0f0" };

const updateImportedProducto = (index: number, key: keyof Producto, value: any) => {
  const updated = [...importedProductos()];
  updated[index] = { ...updated[index], [key]: value };
  setImportedProductos(updated);
};

export default Productos;
