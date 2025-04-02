/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import productoService from "../services/ProductoService";
import { Producto } from "../interfaces/Producto";

const ProductList = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');

  onMount(() => {
    productoService.getProductos().then(setProductos);
  });

  const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setSearchTerm(target.value);
  };

  const filteredProductos = () => productos().filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm().toLowerCase())
  );

  const addToCart = (producto: Producto) => {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Show cart details
  };

  return (
    <div>
      <input type="text" placeholder="Buscar productos..." value={searchTerm()} onInput={handleSearch} />
      <div class="product-container">
        {filteredProductos().map((producto) => (
          <div class="product-item">
            <img src={producto.imagen} alt={producto.nombre} />
            <h2>{producto.nombre}</h2>
            <p class="price">{producto.precio}</p>
            <p>{producto.descripcion}</p>
            <button onClick={() => addToCart(producto)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;