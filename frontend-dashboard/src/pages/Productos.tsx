import { Component, createSignal, onMount } from 'solid-js';
import axios from 'axios';
import { showNotification } from '../components/Notification';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredProductos, setFilteredProductos] = createSignal([]);

  onMount(() => {
    axios.get('/api/productos')
      .then(response => {
        setProductos(response.data);
        setFilteredProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
        showNotification('Error al obtener los productos', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = productos().filter(producto =>
      producto.nombre.toLowerCase().includes(term.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  return (
    <div>
      <h1>Productos</h1>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredProductos().map(producto => (
          <li>{producto.nombre} - {producto.precio}</li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;