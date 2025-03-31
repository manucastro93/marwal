import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Categoria } from '../interfaces/Categoria';
import apiService from '../services/apiService';

const Categorias: Component = () => {
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [editCategoria, setEditCategoria] = createSignal<Categoria | null>(null);
  const [newCategoria, setNewCategoria] = createSignal<Categoria>({ id: 0, nombre: '' });

  onMount(() => {
    apiService.getCategorias()
      .then((response: any) => {
        setCategorias(response.data);
      })
      .catch((error: any) => {
        console.error('Error al obtener las categorias:', error);
        showNotification('Error al obtener las categorias', 'error');
      });
  });

  const handleInputChange = (field: keyof Categoria, value: string) => {
    setNewCategoria({ ...newCategoria(), [field]: value });
  };

  const handleEditChange = (field: keyof Categoria, value: string) => {
    if (editCategoria()) {
      setEditCategoria({ ...editCategoria()!, [field]: value });
    }
  };

  const handleSaveNew = () => {
    apiService.createCategoria(newCategoria())
      .then((response: any) => {
        setCategorias([...categorias(), response.data]);
        showNotification('Categoria creada con éxito', 'success');
        setNewCategoria({ id: 0, nombre: '' });
      })
      .catch((error: any) => {
        console.error('Error al crear la categoria:', error);
        showNotification('Error al crear la categoria', 'error');
      });
  };

  const handleSaveEdit = () => {
    if (editCategoria()) {
      apiService.updateCategoria(editCategoria()!.id, editCategoria()!)
        .then((response: any) => {
          const updatedCategorias = categorias().map(c => c.id === response.data.id ? response.data : c);
          setCategorias(updatedCategorias);
          showNotification('Categoria actualizada con éxito', 'success');
          setEditCategoria(null);
        })
        .catch((error: any) => {
          console.error('Error al actualizar la categoria:', error);
          showNotification('Error al actualizar la categoria', 'error');
        });
    }
  };

  return (
    <div>
      <h1>Categorias</h1>
      <div>
        <h2>Nueva Categoria</h2>
        <input type="text" placeholder="Nombre" value={newCategoria().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
        <button onClick={handleSaveNew}>Guardar</button>
      </div>
      <ul>
        {categorias().map(categoria => (
          <li>
            {editCategoria() && editCategoria()!.id === categoria.id ? (
              <div>
                <input type="text" value={editCategoria()!.nombre} onInput={(e) => handleEditChange('nombre', e.currentTarget.value)} />
                <button onClick={handleSaveEdit}>Actualizar</button>
              </div>
            ) : (
              <div>
                {categoria.nombre}
                <button onClick={() => setEditCategoria(categoria)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;