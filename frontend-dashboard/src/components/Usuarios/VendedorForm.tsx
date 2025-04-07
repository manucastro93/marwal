import { Component, createSignal, createEffect } from 'solid-js';
import { Usuario } from '../../interfaces/Usuario';

interface VendedorFormProps {
  initialVendedor: Usuario;
  onSave: (vendedor: Usuario) => void;
  onClose: () => void;
}

const VendedorForm: Component<VendedorFormProps> = (props) => {
  const [vendedor, setVendedor] = createSignal<Usuario>({
    usuario: props.initialVendedor.usuario || '',
    nombre: props.initialVendedor.nombre || '',
    email: props.initialVendedor.email || '',
    telefono: props.initialVendedor.telefono || '',
    contraseña: props.initialVendedor.contraseña || '',
    rol: props.initialVendedor.rol || 'vendedor',
    estado: props.initialVendedor.rol || 'activo',
    link: props.initialVendedor.link || '',
    createdAt: props.initialVendedor.createdAt || new Date(),
    updatedAt: props.initialVendedor.updatedAt || new Date(),
    id: props.initialVendedor.id || undefined
  });
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    setVendedor({
      usuario: props.initialVendedor.usuario || '',
      nombre: props.initialVendedor.nombre || '',
      email: props.initialVendedor.email || '',
      telefono: props.initialVendedor.telefono || '',
      contraseña: props.initialVendedor.contraseña || '',
      rol: props.initialVendedor.rol || 'vendedor',
      estado: props.initialVendedor.rol || 'activo',
      link: props.initialVendedor.link || '',
      createdAt: props.initialVendedor.createdAt || new Date(),
      updatedAt: props.initialVendedor.updatedAt || new Date(),
      id: props.initialVendedor.id || undefined
    });
  });

  const handleInputChange = (field: keyof Usuario, value: string) => {
    setVendedor((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const currentVendedor = vendedor();
    if (!currentVendedor.nombre || !currentVendedor.telefono || !currentVendedor.usuario || !currentVendedor.email || (!currentVendedor.contraseña && !currentVendedor.id)) {
      setError("Todos los campos excepto teléfono son obligatorios.");
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
      <input type="email" placeholder="Email" value={vendedor().email} onInput={(e) => handleInputChange('email', e.currentTarget.value)} />
      <input type="text" placeholder="Teléfono" value={vendedor().telefono || ''} onInput={(e) => handleInputChange('telefono', e.currentTarget.value)} />
      <input type="text" placeholder="Usuario" value={vendedor().usuario} onInput={(e) => handleInputChange('usuario', e.currentTarget.value)} />
      {!props.initialVendedor.id && (
        <input type="password" placeholder="Contraseña" value={vendedor().contraseña || ''} onInput={(e) => handleInputChange('contraseña', e.currentTarget.value)} />
      )}
      <button style={{ 'background-color': 'green', color: 'white' }} onClick={handleSave}>Guardar</button>
      <button style={{ float: 'right' }} onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default VendedorForm;