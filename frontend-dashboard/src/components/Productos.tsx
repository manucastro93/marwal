import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal([]);

  onMount(() => {
    axios.get('/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener los productos:', error));
  });

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos().map(producto => (
          <li>{producto.nombre} - {producto.precio}</li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;