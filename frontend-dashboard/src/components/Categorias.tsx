import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Categorias: Component = () => {
  const [categorias, setCategorias] = createSignal([]);

  onMount(() => {
    axios.get('/api/categorias')
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al obtener las categorías:', error));
  });

  return (
    <div>
      <h1>Categorías</h1>
      <ul>
        {categorias().map(categoria => (
          <li>{categoria.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;