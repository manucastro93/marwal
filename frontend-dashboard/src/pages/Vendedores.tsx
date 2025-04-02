import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Vendedor } from '../interfaces/Vendedor';
import apiService from '../services/apiService';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import VendedorForm from '../components/VendedorForm';

const Vendedores: Component = () => {
  const [vendedores, setVendedores] = createSignal<Vendedor[]>([]);
  const [filteredVendedores, setFilteredVendedores] = createSignal<Vendedor[]>([]);
  const [editVendedor, setEditVendedor] = createSignal<Vendedor | null>(null);
  const [newVendedor] = createSignal<Vendedor>({ id: 0, nombre: '', telefono: '' });
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

  onMount(() => {
    apiService.getVendedores()
    .then((vendedores) => {
        setVendedores(vendedores);
        setFilteredVendedores(vendedores);
      })
      .catch((error: any) => {
        console.error('Error al obtener los vendedores:', error);
        showNotification('Error al obtener los vendedores', 'error');
      });
  });

  const handleSaveNew = (vendedor: Vendedor) => {
    apiService.createVendedor(vendedor)
      .then((response: any) => {
        const updatedVendedores = [...vendedores(), response.data];
        setVendedores(updatedVendedores);
        setFilteredVendedores(updatedVendedores);
        showNotification('Vendedor creado con éxito', 'success');
        setIsModalOpen(false);
      })
      .catch((error: any) => {
        console.error('Error al crear el vendedor:', error);
        showNotification(`Error al crear el vendedor - ${error.message}`, 'error');
      });
  };

  const handleSaveEdit = (vendedor: Vendedor) => {
    apiService.updateVendedor(vendedor.id, vendedor)
      .then((response: any) => {
        const updatedVendedores = vendedores().map(v => v.id === response.data.id ? response.data : v);
        setVendedores(updatedVendedores);
        setFilteredVendedores(updatedVendedores);
        showNotification('Vendedor actualizado con éxito', 'success');
        setEditVendedor(null);
        setIsEditModalOpen(false);
      })
      .catch((error: any) => {
        console.error('Error al actualizar el vendedor:', error);
        showNotification(`Error al actualizar el vendedor - ${error.message}`, 'error');
      });
  };

  const handleDelete = (id: number) => {
    apiService.deleteVendedor(id)
      .then(() => {
        const updatedVendedores = vendedores().filter(v => v.id !== id);
        setVendedores(updatedVendedores);
        setFilteredVendedores(updatedVendedores);
        showNotification('Vendedor eliminado con éxito', 'success');
      })
      .catch((error: any) => {
        console.error('Error al eliminar el vendedor:', error);
        showNotification(`Error al eliminar el vendedor - ${error.message}`, 'error');
      });
  };

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    const filtered = vendedores().filter(vendedor =>
      vendedor.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVendedores(filtered);
  };

  return (
    <Layout>
      <div class="vendedores">
        <h1>Vendedores</h1>
        <input
          type="text"
          placeholder="Buscar vendedores..."
          value={searchTerm()}
          onInput={handleSearch}
          class="form-control mb-3"
        />
        <button class="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>Nuevo Vendedor</button>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendedores().map(vendedor => (
              <tr>
                <td>{vendedor.id}</td>
                <td>
                  {editVendedor() && editVendedor()!.id === vendedor.id ? (
                    <input 
                      type="text" 
                      value={editVendedor()!.nombre} 
                      onInput={(e) => setEditVendedor({ ...editVendedor()!, nombre: e.currentTarget.value })} 
                    />
                  ) : (
                    vendedor.nombre
                  )}
                </td>
                <td>
                  {editVendedor() && editVendedor()!.id === vendedor.id ? (
                    <input 
                      type="text" 
                      value={editVendedor()!.telefono} 
                      onInput={(e) => setEditVendedor({ ...editVendedor()!, telefono: e.currentTarget.value })} 
                    />
                  ) : (
                    vendedor.telefono
                  )}
                </td>
                <td>
                  {editVendedor() && editVendedor()!.id === vendedor.id ? (
                    <button class="btn btn-success btn-sm" onClick={() => handleSaveEdit(editVendedor()!)}>Guardar</button>
                  ) : (
                    <>
                      <button class="btn btn-warning btn-sm" onClick={() => setEditVendedor(vendedor)}>Editar</button>
                      <button class="btn btn-danger btn-sm" onClick={() => handleDelete(vendedor.id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen() && (
          <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
            <VendedorForm initialVendedor={newVendedor()} onSave={handleSaveNew} onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
        {isEditModalOpen() && (
          <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
            <VendedorForm initialVendedor={editVendedor()!} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Vendedores;