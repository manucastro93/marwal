import { Component, createSignal, onMount } from "solid-js";
import { categoriaService } from "../services/categoriaService";
import { Categoria } from "../interfaces/Categoria";
import Layout from "../components/Layout/Layout";
import Modal from "../components/Layout/Modal";
import CategoriaForm from "../components/Categorias/CategoriaForm";
import { showNotification } from '../components/Layout/Notification';

const Categorias: Component = () => {
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = createSignal<Categoria[]>([]);
  const [editCategoria, setEditCategoria] = createSignal<Categoria | null>(null);
  const [newCategoria] = createSignal<Categoria>({ id: 0, nombre: '' });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

  onMount(() => {
    categoriaService.obtenerCategorias()
      .then((categorias) => {
        setCategorias(categorias);
        setFilteredCategorias(categorias);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        showNotification('Error al obtener las categorías', 'error');
      });
  });

  const handleSaveNew = (categoria: Categoria) => {
    categoriaService.crearCategoria(categoria)
      .then((newCategoria) => {
        const updatedCategorias = [...categorias(), newCategoria];
        setCategorias(updatedCategorias);
        setFilteredCategorias(updatedCategorias);
        showNotification('Categoría creada con éxito', 'success');
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error al crear la categoría:', error);
        showNotification(`Error al crear la categoría - ${error.message}`, 'error');
      });
  };

  const handleSaveEdit = (categoria: Categoria) => {
    categoriaService.actualizarCategoria(categoria.id, categoria)
      .then((updatedCategoria) => {
        const updatedCategorias = categorias().map(c => c.id === updatedCategoria.id ? updatedCategoria : c);
        setCategorias(updatedCategorias);
        setFilteredCategorias(updatedCategorias);
        showNotification('Categoría actualizada con éxito', 'success');
        setEditCategoria(null);
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error('Error al actualizar la categoría:', error);
        showNotification(`Error al actualizar la categoría - ${error.message}`, 'error');
      });
  };

  const handleDelete = (id: number) => {
    categoriaService.eliminarCategoria(id)
      .then(() => {
        const updatedCategorias = categorias().filter(c => c.id !== id);
        setCategorias(updatedCategorias);
        setFilteredCategorias(updatedCategorias);
        showNotification('Categoría eliminada con éxito', 'success');
      })
      .catch((error) => {
        console.error('Error al eliminar la categoría:', error);
        showNotification(`Error al eliminar la categoría - ${error.message}`, 'error');
      });
  };

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    const filtered = categorias().filter(categoria =>
      categoria.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategorias(filtered);
  };

  const handleEditInputChange = (field: keyof Categoria, value: string) => {
    if (editCategoria()) {
      setEditCategoria({ ...editCategoria()!, [field]: value });
    }
  };

  return (
    <Layout>
      <div class="categorias">
        <h1>Categorías</h1>
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm()}
          onInput={handleSearch}
          class="form-control mb-3"
        />
        <button class="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>Nueva Categoría</button>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias().map(categoria => (
              <tr>
                <td>{categoria.id}</td>
                <td>
                  {editCategoria() && editCategoria()!.id === categoria.id ? (
                    <input 
                      type="text" 
                      value={editCategoria()!.nombre} 
                      onInput={(e) => handleEditInputChange('nombre', e.currentTarget.value)} 
                    />
                  ) : (
                    categoria.nombre
                  )}
                </td>
                <td>
                  {editCategoria() && editCategoria()!.id === categoria.id ? (
                    <button class="btn btn-success btn-sm" onClick={() => handleSaveEdit(editCategoria()!)}>Guardar</button>
                  ) : (
                    <>
                      <button class="btn btn-warning btn-sm" onClick={() => setEditCategoria(categoria)}>Editar</button>
                      <button class="btn btn-danger btn-sm right" onClick={() => handleDelete(categoria.id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen() && (
          <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
            <CategoriaForm initialCategoria={newCategoria()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
        {isEditModalOpen() && (
          <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
            <CategoriaForm initialCategoria={editCategoria()!} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Categorias;