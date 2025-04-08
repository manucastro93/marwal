import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Layout/Notification';
import { Vendedor } from '../interfaces/Vendedor';
import { vendedorService } from '../services/vendedorService';
import Layout from '../components/Layout/Layout';
import Modal from '../components/Layout/Modal';
import VendedorForm from '../components/Usuarios/VendedorForm';

const Vendedores: Component = () => {
  const [vendedores, setVendedores] = createSignal<Vendedor[]>([]);
  const [filteredVendedores, setFilteredVendedores] = createSignal<Vendedor[]>([]);
  const [editVendedor, setEditVendedor] = createSignal<Vendedor | null>(null);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

  onMount(() => {
    vendedorService.obtenerVendedores()
      .then((vendedores) => {
        const activeVendedores = Array.isArray(vendedores) ? vendedores.filter(v => v.estado === 'activo') : [];
        setVendedores(activeVendedores);
        setFilteredVendedores(activeVendedores);
      })
      .catch((error: any) => {
        console.error('Error al obtener los vendedores:', error);
        showNotification('Error al obtener los vendedores', 'error');
      });
  });

  const handleSaveEdit = (vendedor: Vendedor) => {
    const saveAction = vendedor.id ? vendedorService.actualizarVendedor(vendedor.id, vendedor) : vendedorService.crearVendedor(vendedor);
    saveAction
      .then((savedVendedor: Vendedor) => {
        const updatedVendedores = vendedor.id
          ? vendedores().map(v => v.id === savedVendedor.id ? savedVendedor : v)
          : [...vendedores(), savedVendedor];
        console.log('Vendedores actualizados después de guardar:', updatedVendedores);
        setVendedores(updatedVendedores);
        setFilteredVendedores(updatedVendedores);
        showNotification(vendedor.id ? 'Vendedor actualizado con éxito' : 'Vendedor agregado con éxito', 'success');
        setEditVendedor(null);
        setIsEditModalOpen(false);
      })
      .catch((error: any) => {
        console.error('Error al guardar el vendedor:', error);
        showNotification(`Error al guardar el vendedor - ${error.message}`, 'error');
      });
  };

  const handleDelete = (id: number) => {
    vendedorService.eliminarVendedor(id)
      .then(() => {
        const updatedVendedores = vendedores().filter(v => v.id !== id);
        console.log('Vendedores actualizados después de eliminar:', updatedVendedores);
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
    console.log('Término de búsqueda:', value);
    const filtered = vendedores().filter(vendedor =>
      vendedor.nombre.toLowerCase().includes(value.toLowerCase()) || 
      vendedor.email.toLowerCase().includes(value.toLowerCase())
    );
    console.log('Vendedores filtrados:', filtered);
    setFilteredVendedores(filtered);
  };

  return (
    <Layout>
      <div class="vendedores">
        <h1>Vendedores</h1>
        <button class="btn btn-primary mb-3" onClick={() => { setEditVendedor({} as Vendedor); setIsEditModalOpen(true); }}>Agregar Vendedor</button>
        <input
          type="text"
          placeholder="Buscar vendedores..."
          value={searchTerm()}
          onInput={handleSearch}
          class="form-control mb-3"
        />
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Link</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendedores().map(vendedor => (
              <tr>
                <td>{vendedor.id}</td>
                <td>{vendedor.usuario}</td>
                <td>{vendedor.nombre}</td>
                <td>{vendedor.email}</td>
                <td>{vendedor.telefono}</td>
                <td>{'https://marwal.onrender.com/'+vendedor.link}</td>
                <td>
                  <button class="btn btn-warning btn-sm" onClick={() => { setEditVendedor(vendedor); setIsEditModalOpen(true); }}>Editar</button>
                  <button class="btn btn-danger btn-sm right" onClick={() => vendedor.id && handleDelete(vendedor.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isEditModalOpen() && (
          <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
            <VendedorForm initialVendedor={editVendedor() || {} as Vendedor} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Vendedores;