import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';
import { showNotification } from '../components/Notification';

const Clientes: Component = () => {
  const [clientes, setClientes] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredClientes, setFilteredClientes] = createSignal([]);

  onMount(() => {
    axios.get('/api/clientes')
      .then(response => {
        setClientes(response.data);
        setFilteredClientes(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
        showNotification('Error al obtener los clientes', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = clientes().filter(cliente =>
      cliente.nombre.toLowerCase().includes(term.toLowerCase()) ||
      cliente.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredClientes(filtered);
  };

  return (
    <div>
      <h1>Clientes</h1>
      <input
        type="text"
        placeholder="Buscar clientes..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredClientes().map(cliente => (
          <li>{cliente.nombre} - {cliente.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;