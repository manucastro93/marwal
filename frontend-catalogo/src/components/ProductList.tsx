/* @jsxImportSource solid-js */
import { createSignal, onMount, createEffect } from "solid-js";
import productoService from "../services/ProductoService";
import { Producto } from "../interfaces/Producto";

interface ProductListProps {
  selectedCategoryId: number;
  carrito: { [id: string]: { producto: Producto, cantidad: number } };
  setCarrito: (value: { [id: string]: { producto: Producto, cantidad: number } }) => void;
  setMostrarCarrito: (value: boolean) => void;
}

const ProductList = (props: ProductListProps) => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = createSignal<Producto[]>([]);
  const BASE_URL = 'http://localhost:3000';
  const fetchProductos = async () => {
    try {
      const data = await productoService.getProductos();
      setProductos(data);
      filterProductos(data, props.selectedCategoryId);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const filterProductos = (productos: Producto[], categoryId: number) => {
    if (categoryId) {
      setFilteredProductos(productos.filter(producto => producto.categoria_id === categoryId));
    } else {
      setFilteredProductos(productos);
    }
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

  onMount(() => {
    fetchProductos();
  });

  createEffect(() => {
    filterProductos(productos(), props.selectedCategoryId);
  });

  return (
    <div class="product-container">
      {filteredProductos().map(producto => (
        <div class="product-item">
          {producto.imagenes[0] && <img src={BASE_URL+producto.imagenes[0].url} alt={producto.nombre} />}
          <h2>{producto.nombre}</h2>
          <p>{producto.descripcion}</p>
          <div class="price">${producto.precio}</div>
          <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;