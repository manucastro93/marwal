import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Categoria } from '../interfaces/Categoria';
import { apiService } from '../services/apiService';

const Categorias: Component = () => {
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredCategorias, setFilteredCategorias] = createSignal<Categoria[]>([]);

  onMount(() => {
    apiService.getCategorias()
      .then(response => {
        setCategorias(response.data);
        setFilteredCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
        showNotification('Error al obtener las categorías', 'error');
      });
  });

  const handleSearch = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value;
    setSearchTerm(term);
    const filtered = categorias().filter(categoria =>
      categoria.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategorias(filtered);
  };

  return (
    <div>
      <h1>Categorías</h1>
      <input
        type="text"
        placeholder="Buscar categorías..."
        value={searchTerm()}
        onInput={handleSearch}
        class="form-control mb-3"
      />
      <ul>
        {filteredCategorias().map(categoria => (
          <li>{categoria.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;