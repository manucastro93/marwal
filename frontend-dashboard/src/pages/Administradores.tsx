import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Layout/Notification';
import { Administrador } from '../interfaces/Administrador';
import apiService from '../services/apiService';

const Administradores: Component = () => {
  const [administradores, setAdministradores] = createSignal<Administrador[]>([]);
  const [editAdministrador, setEditAdministrador] = createSignal<Administrador | null>(null);
  const [newAdministrador, setNewAdministrador] = createSignal<Administrador>({ id: 0, nombre: '', email: '' });

  onMount(() => {
    apiService.getAdministradores()
      .then((response: any) => {
        setAdministradores(response.data);
      })
      .catch((error: any) => {
        console.error('Error al obtener los administradores:', error);
        showNotification('Error al obtener los administradores', 'error');
      });
  });

  const handleInputChange = (field: keyof Administrador, value: string) => {
    setNewAdministrador({ ...newAdministrador(), [field]: value });
  };

  const handleEditChange = (field: keyof Administrador, value: string) => {
    if (editAdministrador()) {
      setEditAdministrador({ ...editAdministrador()!, [field]: value });
    }
  };

  const handleSaveNew = () => {
    apiService.createAdministrador(newAdministrador())
      .then((response: any) => {
        setAdministradores([...administradores(), response.data]);
        showNotification('Administrador creado con éxito', 'success');
        setNewAdministrador({ id: 0, nombre: '', email: '' });
      })
      .catch((error: any) => {
        console.error('Error al crear el administrador:', error);
        showNotification('Error al crear el administrador', 'error');
      });
  };

  const handleSaveEdit = () => {
    if (editAdministrador()) {
      apiService.updateAdministrador(editAdministrador()!.id, editAdministrador()!)
        .then((response: any) => {
          const updatedAdministradores = administradores().map(a => a.id === response.data.id ? response.data : a);
          setAdministradores(updatedAdministradores);
          showNotification('Administrador actualizado con éxito', 'success');
          setEditAdministrador(null);
        })
        .catch((error: any) => {
          console.error('Error al actualizar el administrador:', error);
          showNotification('Error al actualizar el administrador', 'error');
        });
    }
  };

  return (
    <div>
      <h1>Administradores</h1>
      <div>
        <h2>Nuevo Administrador</h2>
        <input type="text" placeholder="Nombre" value={newAdministrador().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
        <input type="text" placeholder="Email" value={newAdministrador().email} onInput={(e) => handleInputChange('email', e.currentTarget.value)} />
        <button onClick={handleSaveNew}>Guardar</button>
      </div>
      <ul>
        {administradores().map(administrador => (
          <li>
            {editAdministrador() && editAdministrador()!.id === administrador.id ? (
              <div>
                <input type="text" value={editAdministrador()!.nombre} onInput={(e) => handleEditChange('nombre', e.currentTarget.value)} />
                <input type="text" value={editAdministrador()!.email} onInput={(e) => handleEditChange('email', e.currentTarget.value)} />
                <button onClick={handleSaveEdit}>Actualizar</button>
              </div>
            ) : (
              <div>
                {administrador.nombre} - {administrador.email}
                <button onClick={() => setEditAdministrador(administrador)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Administradores;