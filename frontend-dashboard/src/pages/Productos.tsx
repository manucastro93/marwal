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
  const [newProducto] = createSignal<Producto>({ id: 0, nombre: '', precio: 0, categoria_id: 0, descripcion: '', stock: 0 });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const itemsPerPage = 5;

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

  const handleEditChange = (field: keyof Producto, value: string | number) => {
    if (editProducto()) {
      setEditProducto({ ...editProducto()!, [field]: value });
    }
  };

  const handleSaveNew = (producto: Producto) => {
    apiService.createProducto(producto)
      .then((newProducto) => {
        setProductos([...productos(), newProducto]);
        showNotification('Producto creado con éxito', 'success');
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
        showNotification('Error al crear el producto', 'error');
      });
  };

  const handleSaveEdit = () => {
    if (editProducto()) {
      apiService.updateProducto(editProducto()!.id, editProducto()!)
        .then((producto) => {
          const updatedProductos = productos().map(p => p.id === producto.id ? producto : p);
          setProductos(updatedProductos);
          showNotification('Producto actualizado con éxito', 'success');
          setEditProducto(null);
        })
        .catch((error) => {
          console.error('Error al actualizar el producto:', error);
          showNotification('Error al actualizar el producto', 'error');
        });
    }
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

  return (
    <Layout>
      <h1>Productos</h1>
      <button onClick={() => setIsModalOpen(true)}>Nuevo Producto</button>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <ProductoForm initialProducto={newProducto()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div>
        <h2>Buscar Producto</h2>
        <input type="text" placeholder="Buscar..." value={searchTerm()} onInput={handleSearch} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProductos().map(producto => (
            <tr>
              {editProducto() && editProducto()!.id === producto.id ? (
                <>
                  <td><input type="text" value={editProducto()!.nombre} onInput={(e) => handleEditChange('nombre', e.currentTarget.value)} /></td>
                  <td><input type="number" value={editProducto()!.precio} onInput={(e) => handleEditChange('precio', parseFloat(e.currentTarget.value))} /></td>
                  <td>
                    <select value={editProducto()!.categoria_id} onChange={(e) => handleEditChange('categoria_id', e.currentTarget.value)}>
                      <option value="">Seleccionar Categoría</option>
                      {categorias().map(categoria => (
                        <option value={categoria.id}>{categoria.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td><textarea value={editProducto()!.descripcion} onInput={(e) => handleEditChange('descripcion', e.currentTarget.value)}></textarea></td>
                  <td><input type="number" value={editProducto()!.stock} onInput={(e) => handleEditChange('stock', parseInt(e.currentTarget.value))} /></td>
                  <td><button onClick={handleSaveEdit}>Actualizar</button></td>
                </>
              ) : (
                <>
                  <td>{producto.nombre}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.categoria_id}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.stock}</td>
                  <td><button onClick={() => setEditProducto(producto)}>Editar</button></td>
                </>
              )}
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