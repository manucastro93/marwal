import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';
import { showNotification } from '../components/Notification';

const Vendedores: Component = () => {
  const [vendedores, setVendedores] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredVendedores, setFilteredVendedores] = createSignal([]);

  onMount(() => {
    axios.get('/api/vendedores')
      .then(response => {
        setVendedores(response.data);
        setFilteredVendedores(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los vendedores:', error);
        showNotification('Error al obtener los vendedores', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = vendedores().filter(vendedor =>
      vendedor.nombre.toLowerCase().includes(term.toLowerCase()) ||
      vendedor.telefono.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredVendedores(filtered);
  };

  return (
    <div>
      <h1>Vendedores</h1>
      <input
        type="text"
        placeholder="Buscar vendedores..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredVendedores().map(vendedor => (
          <li>{vendedor.nombre} - {vendedor.telefono}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vendedores;