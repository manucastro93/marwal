import { Component, createSignal, createEffect } from 'solid-js';
import { Cliente } from '../interfaces/Cliente';

interface ClienteFormProps {
  initialCliente: Cliente;
  onSave: (cliente: Cliente) => void;
  onClose: () => void;
}

const ClienteForm: Component<ClienteFormProps> = (props) => {
  const [cliente, setCliente] = createSignal(props.initialCliente);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    setCliente(props.initialCliente);
  });

  const handleInputChange = (field: keyof Cliente, value: string) => {
    setCliente({ ...cliente(), [field]: value });
  };

  const handleSave = async () => {
    const currentCliente = cliente();
    if (!currentCliente.nombre || !currentCliente.email) {
      setError("El nombre y el email del cliente son obligatorios.");
      return;
    }
    try {
      await props.onSave(cliente());
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error al guardar el cliente');
    }
  };

  return (
    <div>
      <h2>Editar Cliente</h2>
      {error() && <div class="error-message">{error()}</div>}
      <input type="text" placeholder="Nombre" value={cliente().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      <input type="email" placeholder="Email" value={cliente().email} onInput={(e) => handleInputChange('email', e.currentTarget.value)} />
      <button style={{ 'background-color': 'green', color: 'white' }} onClick={handleSave}>Guardar</button>
      <button style={{ float: 'right' }} onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default ClienteForm;