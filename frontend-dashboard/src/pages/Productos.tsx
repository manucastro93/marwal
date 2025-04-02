import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Producto } from '../interfaces/Producto';
import { Categoria } from '../interfaces/Categoria';
import apiService from '../services/apiService';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ProductoForm from '../components/ProductoForm';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const [editProducto, setEditProducto] = createSignal<Producto | null>(null);
  const [newProducto] = createSignal<Producto>({ id: 0, codigo: '', nombre: '', descripcion: '', precio: 0, categoria_id: 0, stock: 0, imagenes: [] });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);
  const itemsPerPage = 10;

  onMount(() => {
    apiService.getProductos()
      .then((productos) => {
        setProductos(productos);
        setFilteredProductos(productos);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        showNotification('Error al obtener los productos', 'error');
      });

    apiService.getCategorias()
      .then((categorias) => {
        setCategorias(categorias);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        showNotification('Error al obtener las categorías', 'error');
      });
  });

  const handleSaveNew = (producto: Producto) => {
    apiService.createProducto(producto)
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
    apiService.updateProducto(producto.id, producto)
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
    apiService.deleteProducto(id)
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
    const filtered = productos().filter(producto =>
      producto.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProductos(filtered);
    setCurrentPage(1); // Reset to first page on search
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
  const url = 'http://localhost:3000';
  return (
    <Layout>
      <h1>Productos</h1>
      <button onClick={() => setIsModalOpen(true)}>Nuevo Producto</button>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <ProductoForm initialProducto={newProducto()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
        {editProducto() && (
          <ProductoForm initialProducto={editProducto()!} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
        )}
      </Modal>
      <div>
        <h2>Buscar Producto</h2>
        <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Imagen</th> {/* Cambiado a singular */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductos().map(producto => (
            <tr>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{getCategoriaNombre(producto.categoria_id)}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.stock}</td>
              <td>
                {producto.imagenes && producto.imagenes.length > 0 && (
                  <img src={url + producto.imagenes[0].url} alt={`Imagen principal`} width="80" />
                )}
              </td>
              <td>
                <button onClick={() => { setEditProducto(producto); setIsEditModalOpen(true); }}>Editar</button>
                <button style={{ 'background-color': 'red', color: 'white', float: 'right' }} onClick={() => handleDelete(producto.id)}>Eliminar</button>
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

export default Productos;