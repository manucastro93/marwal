import { Component, createSignal, createEffect } from 'solid-js';
import { Vendedor } from '../interfaces/Vendedor';

interface VendedorFormProps {
  initialVendedor: Vendedor;
  onSave: (vendedor: Vendedor) => void;
  onClose: () => void;
}

const VendedorForm: Component<VendedorFormProps> = (props) => {
  const [vendedor, setVendedor] = createSignal(props.initialVendedor);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    setVendedor(props.initialVendedor);
  });

  const handleInputChange = (field: keyof Vendedor, value: string) => {
    setVendedor({ ...vendedor(), [field]: value });
  };

  const handleSave = async () => {
    const currentVendedor = vendedor();
    if (!currentVendedor.nombre || !currentVendedor.telefono) {
      setError("El nombre y el teléfono del vendedor son obligatorios.");
      return;
    }
    try {
      await props.onSave(vendedor());
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error al guardar el vendedor');
    }
  };

  return (
    <div>
      <h2>{props.initialVendedor.id ? 'Editar Vendedor' : 'Nuevo Vendedor'}</h2>
      {error() && <div class="error-message">{error()}</div>}
      <input type="text" placeholder="Nombre" value={vendedor().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      <input type="text" placeholder="Teléfono" value={vendedor().telefono} onInput={(e) => handleInputChange('telefono', e.currentTarget.value)} />
      <button style={{ 'background-color': 'green', color: 'white' }} onClick={handleSave}>Guardar</button>
      <button style={{ float: 'right' }} onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default VendedorForm;