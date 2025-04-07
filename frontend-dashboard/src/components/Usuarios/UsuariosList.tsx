import { createSignal, createResource, For, Show } from 'solid-js';
import { usuarioService } from '../../services/usuarioService';
import { Usuario } from '../../interfaces/Usuario';
import UsuarioForm from './UsuarioForm';
import UsuarioDetalles from './UsuarioDetalles';
import NotificacionError from '../Layout/NotificacionError';
import '../../assets/css/usuarios.css';

const UsuariosList = () => {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  const [search, setSearch] = createSignal('');
  const [role, setRole] = createSignal('');

  const [usuarios, { mutate, refetch }] = createResource(() => usuarioService.obtenerUsuarios(page(), limit(), search(), role()));

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [showDetailsModal, setShowDetailsModal] = createSignal(false);
  const [currentUser, setCurrentUser] = createSignal<Usuario | undefined>(undefined);
  const [error, setError] = createSignal('');

  const handleSearch = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
    refetch();
  };

  const handleRoleFilter = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setRole(target.value);
    refetch();
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user: Usuario) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleViewDetails = (user: Usuario) => {
    setCurrentUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await usuarioService.eliminarUsuario(id);
      refetch();
    } catch (error) {
      setError('Error al eliminar usuario: ' + error.message);
    }
  };

  return (
    <div class="usuarios-list">
      <NotificacionError message={error()} onClose={() => setError('')} />
      <div class="usuarios-actions">
        <button class="add-btn" onClick={handleAddUser}>Agregar Usuario</button>
      </div>
      <div class="usuarios-filters">
        <input type="text" placeholder="Buscar usuario" onInput={handleSearch} class="search-input" />
        <select onChange={handleRoleFilter} class="role-select">
          <option value="">Todos</option>
          <option value="supremo">Supremo</option>
          <option value="administrador">Administrador</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>
      <table class="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <For each={usuarios()}>
            {(usuario) => (
              <tr>
                <td>{usuario.usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button class="view-btn" onClick={() => handleViewDetails(usuario)}>View</button>
                  <button class="edit-btn" onClick={() => handleEditUser(usuario)}>Edit</button>
                  <button class="delete-btn" onClick={() => handleDeleteUser(usuario.id)}>Delete</button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="pagination">
        <button onClick={() => setPage(page() - 1)} disabled={page() === 1} class="pagination-btn">Anterior</button>
        <button onClick={() => setPage(page() + 1)} class="pagination-btn">Siguiente</button>
      </div>

      <Show when={showAddModal()}>
        <div class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => setShowAddModal(false)}>&times;</span>
            <h2>Agregar Usuario</h2>
            <UsuarioForm onClose={() => setShowAddModal(false)} onSave={refetch} />
          </div>
        </div>
      </Show>

      <Show when={showEditModal()}>
        <div class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h2>Editar Usuario</h2>
            <UsuarioForm usuario={currentUser()} onClose={() => setShowEditModal(false)} onSave={refetch} />
          </div>
        </div>
      </Show>

      <Show when={showDetailsModal()}>
        <div class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => setShowDetailsModal(false)}>&times;</span>
            <h2>Detalles del Usuario</h2>
            {currentUser() && <UsuarioDetalles usuario={currentUser()!} onClose={() => setShowDetailsModal(false)} />}
          </div>
        </div>
      </Show>
    </div>
  );
};

export default UsuariosList;