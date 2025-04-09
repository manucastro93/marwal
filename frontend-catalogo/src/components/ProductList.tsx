/* @jsxImportSource solid-js */
import { createSignal, onMount, createEffect } from "solid-js";
import {productoService} from "../services/productoService";
import { Producto } from "../interfaces/Producto";
import ProductSearch from "./ProductSearch"; // Importa el componente ProductSearch

interface ProductListProps {
  onProductDblClick(producto: Producto): void;
  selectedCategoryId: number;
  carrito: { [id: string]: { producto: Producto, cantidad: number } };
  setCarrito: (value: { [id: string]: { producto: Producto, cantidad: number } }) => void;
  setMostrarCarrito: (value: boolean) => void;
  searchQuery: string;
  onProductDblClick: (product: Producto) => void;
  onSearch: (query: string) => void; // Agrega la función de búsqueda como prop
}

const ProductList = (props: ProductListProps) => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const productsPerPage = 10;

  const fetchProductos = async () => {
    try {
      const data = await productoService.getProductos();
      console.log("Productos fetched:", data); // Log de productos obtenidos
      setProductos(data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const filterProductos = () => {
    let filtered = productos();
    if (props.selectedCategoryId) {
      filtered = filtered.filter(producto => producto.categoria_id === props.selectedCategoryId);
    }
    if (props.searchQuery) {
      filtered = filtered.filter(producto => producto.nombre.toLowerCase().includes(props.searchQuery.toLowerCase()));
    }
    console.log("Filtered Productos:", filtered); // Log de productos filtrados
    setFilteredProductos(filtered);
    setCurrentPage(1); // Reset to first page on filter
  };

  const agregarAlCarrito = (producto: Producto) => {
    const nuevoCarrito = { ...props.carrito };
    if (nuevoCarrito[producto.id]) {
      nuevoCarrito[producto.id].cantidad += 1;
    } else {
      nuevoCarrito[producto.id] = { producto, cantidad: 1 };
    }
    props.setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    props.setMostrarCarrito(true); // Mostrar carrito al agregar producto
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = () => currentPage() * productsPerPage;
  const indexOfFirstProduct = () => indexOfLastProduct() - productsPerPage;
  const currentProducts = () => filteredProductos().slice(indexOfFirstProduct(), indexOfLastProduct());

  // Logs adicionales para verificar índices de paginación
  createEffect(() => {
    console.log(`Current Page: ${currentPage()}`);
    console.log(`Index of First Product: ${indexOfFirstProduct()}`);
    console.log(`Index of Last Product: ${indexOfLastProduct()}`);
    console.log("Current Products:", currentProducts());
  });

  onMount(() => {
    fetchProductos();
  });

  createEffect(() => {
    filterProductos();
  });

  return (
    <div class="product-list-container">
      <div class="product-search-wrapper">
        <ProductSearch onSearch={props.onSearch} />
      </div>
      <div class="product-container">
        {currentProducts().length > 0 ? (
          currentProducts().map(producto => (
            <div class="product-item" onDblClick={() => props.onProductDblClick(producto)}>
              {producto.imagenes[0] && <img src={producto.imagenes[0].url} alt={producto.nombre} />}
              <h2>{producto.nombre}</h2>
              <div class="price">${producto.precio}</div>
              <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
      <div class="pagination">
        {Array.from({ length: Math.ceil(filteredProductos().length / productsPerPage) }).map(
          (_, index) => (
            <button
              class={currentPage() === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;