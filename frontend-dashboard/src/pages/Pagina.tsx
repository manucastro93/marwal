import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';
import { showNotification } from '../components/Notification';

const Pagina: Component = () => {
  const [pagina, setPagina] = createSignal({});

  onMount(() => {
    axios.get('/api/pagina')
      .then(response => setPagina(response.data))
      .catch(error => {
        console.error('Error al obtener la página:', error);
        showNotification('Error al obtener la página', 'error');
      });
  });

  return (
    <div>
      <h1>Página</h1>
      <div>{pagina().contenido}</div>
    </div>
  );
};

export default Pagina;