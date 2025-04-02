import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Cliente } from '../interfaces/Cliente';
import apiService from '../services/apiService';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ClienteForm from '../components/ClienteForm';

const Clientes: Component = () => {
  const [clientes, setClientes] = createSignal<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = createSignal<Cliente[]>([]);
  const [editCliente, setEditCliente] = createSignal<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);

  onMount(() => {
    apiService.getClientes()
      .then((clientes) => {
        setClientes(clientes);
        setFilteredClientes(clientes);
      })
      .catch((error: any) => {
        console.error('Error al obtener los clientes:', error);
        showNotification('Error al obtener los clientes', 'error');
      });
  });


  const handleSaveEdit = (cliente: Cliente) => {
    apiService.updateCliente(cliente.id, cliente)
      .then((response: any) => {
        const updatedClientes = clientes().map(c => c.id === response.data.id ? response.data : c);
        setClientes(updatedClientes);
        setFilteredClientes(updatedClientes);
        showNotification('Cliente actualizado con éxito', 'success');
        setEditCliente(null);
        setIsEditModalOpen(false);
      })
      .catch((error: any) => {
        console.error('Error al actualizar el cliente:', error);
        showNotification(`Error al actualizar el cliente - ${error.message}`, 'error');
      });
  };

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    const filtered = clientes().filter(cliente =>
      cliente.nombre.toLowerCase().includes(value.toLowerCase()) || 
      cliente.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClientes(filtered);
  };

  return (
    <Layout>
      <div class="clientes">
        <h1>Clientes</h1>
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm()}
          onInput={handleSearch}
          class="form-control mb-3"
        />
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes().map(cliente => (
              <tr>
                <td>{cliente.id}</td>
                <td>
                  {editCliente() && editCliente()!.id === cliente.id ? (
                    <input 
                      type="text" 
                      value={editCliente()!.nombre} 
                      onInput={(e) => setEditCliente({ ...editCliente()!, nombre: e.currentTarget.value })} 
                    />
                  ) : (
                    cliente.nombre
                  )}
                </td>
                <td>
                  {editCliente() && editCliente()!.id === cliente.id ? (
                    <input 
                      type="email" 
                      value={editCliente()!.email} 
                      onInput={(e) => setEditCliente({ ...editCliente()!, email: e.currentTarget.value })} 
                    />
                  ) : (
                    cliente.email
                  )}
                </td>
                <td>
                  {editCliente() && editCliente()!.id === cliente.id ? (
                    <button class="btn btn-success btn-sm" onClick={() => handleSaveEdit(editCliente()!)}>Guardar</button>
                  ) : (
                    <>
                      <button class="btn btn-warning btn-sm" onClick={() => setEditCliente(cliente)}>Editar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isEditModalOpen() && (
          <Modal isOpen={isEditModalOpen()} onClose={() => setIsEditModalOpen(false)}>
            <ClienteForm initialCliente={editCliente()!} onSave={handleSaveEdit} onClose={() => setIsEditModalOpen(false)} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Clientes;