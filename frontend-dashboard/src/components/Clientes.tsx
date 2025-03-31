import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Clientes: Component = () => {
  const [clientes, setClientes] = createSignal([]);

  onMount(() => {
    axios.get('/api/clientes')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error al obtener los clientes:', error));
  });

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clientes().map(cliente => (
          <li>{cliente.nombre} - {cliente.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;