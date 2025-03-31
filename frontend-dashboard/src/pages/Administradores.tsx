import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Administrador } from '../interfaces/Administrador';
import { apiService } from '../services/apiService';

const Administradores: Component = () => {
  const [administradores, setAdministradores] = createSignal<Administrador[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredAdministradores, setFilteredAdministradores] = createSignal<Administrador[]>([]);

  onMount(() => {
    apiService.getAdministradores()
      .then(response => {
        setAdministradores(response.data);
        setFilteredAdministradores(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los administradores:', error);
        showNotification('Error al obtener los administradores', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = administradores().filter(administrador =>
      administrador.nombre.toLowerCase().includes(term.toLowerCase()) ||
      administrador.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAdministradores(filtered);
  };

  return (
    <div>
      <h1>Administradores</h1>
      <input
        type="text"
        placeholder="Buscar administradores..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredAdministradores().map(administrador => (
          <li>{administrador.nombre} - {administrador.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Administradores;