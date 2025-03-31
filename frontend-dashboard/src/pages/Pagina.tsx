import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Pagina as PaginaInterface } from '../interfaces/Pagina';
import { apiService } from '../services/apiService';

const Pagina: Component = () => {
  const [pagina, setPagina] = createSignal<PaginaInterface | null>(null);

  onMount(() => {
    apiService.getPagina()
      .then(response => setPagina(response.data))
      .catch(error => {
        console.error('Error al obtener la página:', error);
        showNotification('Error al obtener la página', 'error');
      });
  });

  return (
    <div>
      <h1>Página</h1>
      {pagina() ? <div>{pagina()!.contenido}</div> : <p>Cargando...</p>}
    </div>
  );
};

export default Pagina;