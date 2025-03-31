import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Vendedores: Component = () => {
  const [vendedores, setVendedores] = createSignal([]);

  onMount(() => {
    axios.get('/api/vendedores')
      .then(response => setVendedores(response.data))
      .catch(error => console.error('Error al obtener los vendedores:', error));
  });

  return (
    <div>
      <h1>Vendedores</h1>
      <ul>
        {vendedores().map(vendedor => (
          <li>{vendedor.nombre} - {vendedor.telefono}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vendedores;