import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Vendedor } from '../interfaces/Vendedor';
import apiService from '../services/apiService';

const Vendedores: Component = () => {
  const [vendedores, setVendedores] = createSignal<Vendedor[]>([]);
  const [editVendedor, setEditVendedor] = createSignal<Vendedor | null>(null);
  const [newVendedor, setNewVendedor] = createSignal<Vendedor>({ id: 0, nombre: '', telefono: '' });

  onMount(() => {
    apiService.getVendedores()
      .then((response: any) => {
        setVendedores(response.data);
      })
      .catch((error: any) => {
        console.error('Error al obtener los vendedores:', error);
        showNotification('Error al obtener los vendedores', 'error');
      });
  });

  const handleInputChange = (field: keyof Vendedor, value: string) => {
    setNewVendedor({ ...newVendedor(), [field]: value });
  };

  const handleEditChange = (field: keyof Vendedor, value: string) => {
    if (editVendedor()) {
      setEditVendedor({ ...editVendedor()!, [field]: value });
    }
  };

  const handleSaveNew = () => {
    apiService.createVendedor(newVendedor())
      .then((response: any) => {
        setVendedores([...vendedores(), response.data]);
        showNotification('Vendedor creado con éxito', 'success');
        setNewVendedor({ id: 0, nombre: '', telefono: '' });
      })
      .catch((error: any) => {
        console.error('Error al crear el vendedor:', error);
        showNotification('Error al crear el vendedor', 'error');
      });
  };

  const handleSaveEdit = () => {
    if (editVendedor()) {
      apiService.updateVendedor(editVendedor()!.id, editVendedor()!)
        .then((response: any) => {
          const updatedVendedores = vendedores().map(v => v.id === response.data.id ? response.data : v);
          setVendedores(updatedVendedores);
          showNotification('Vendedor actualizado con éxito', 'success');
          setEditVendedor(null);
        })
        .catch((error: any) => {
          console.error('Error al actualizar el vendedor:', error);
          showNotification('Error al actualizar el vendedor', 'error');
        });
    }
  };

  return (
    <div>
      <h1>Vendedores</h1>
      <div>
        <h2>Nuevo Vendedor</h2>
        <input type="text" placeholder="Nombre" value={newVendedor().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
        <input type="text" placeholder="Teléfono" value={newVendedor().telefono} onInput={(e) => handleInputChange('telefono', e.currentTarget.value)} />
        <button onClick={handleSaveNew}>Guardar</button>
      </div>
      <ul>
        {vendedores().map(vendedor => (
          <li>
            {editVendedor() && editVendedor()!.id === vendedor.id ? (
              <div>
                <input type="text" value={editVendedor()!.nombre} onInput={(e) => handleEditChange('nombre', e.currentTarget.value)} />
                <input type="text" value={editVendedor()!.telefono} onInput={(e) => handleEditChange('telefono', e.currentTarget.value)} />
                <button onClick={handleSaveEdit}>Actualizar</button>
              </div>
            ) : (
              <div>
                {vendedor.nombre} - {vendedor.telefono}
                <button onClick={() => setEditVendedor(vendedor)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vendedores;