import { Component, createSignal, createEffect } from 'solid-js';
import { Categoria } from '../interfaces/Categoria';

interface CategoriaFormProps {
  initialCategoria: Categoria;
  onSave: (categoria: Categoria) => void;
  onClose: () => void;
}

const CategoriaForm: Component<CategoriaFormProps> = (props) => {
  const [categoria, setCategoria] = createSignal(props.initialCategoria);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    setCategoria(props.initialCategoria);
  });

  const handleInputChange = (field: keyof Categoria, value: string) => {
    setCategoria({ ...categoria(), [field]: value });
  };

  const handleSave = async () => {
    const currentCategoria = categoria();
    if (!currentCategoria.nombre) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    try {
      await props.onSave(categoria());
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error al guardar la categoría');
    }
  };

  return (
    <div>
      <h2>{props.initialCategoria.id ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
      {error() && <div class="error-message">{error()}</div>}
      <input type="text" placeholder="Nombre" value={categoria().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      <button style={{ 'background-color': 'green', color: 'white' }} onClick={handleSave}>Guardar</button>
      <button style={{ float: 'right' }} onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default CategoriaForm;