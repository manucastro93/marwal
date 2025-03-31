import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';

const Administradores: Component = () => {
  const [administradores, setAdministradores] = createSignal([]);

  onMount(() => {
    axios.get('/api/administradores')
      .then(response => setAdministradores(response.data))
      .catch(error => console.error('Error al obtener los administradores:', error));
  });

  return (
    <div>
      <h1>Administradores</h1>
      <ul>
        {administradores().map(administrador => (
          <li>{administrador.nombre} - {administrador.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Administradores;