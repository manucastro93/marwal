import { createSignal, onMount } from 'solid-js';
import { clienteService } from '../../services/clienteService';
import { Cliente } from '../../interfaces/Cliente';

const ClientesList = () => {
  const [clientes, setClientes] = createSignal<Cliente[]>([]);

  onMount(async () => {
    const data = await clienteService.obtenerClientes();
    setClientes(data);
  });

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <ul>
        {clientes().map(cliente => (
          <li>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesList;