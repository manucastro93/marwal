/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import Banner from "./components/Banner";
import CartButton from "./components/CartButton";
import { Producto } from "./interfaces/Producto";
import vendedorService from "./services/VendedorService";

const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = createSignal<number>(0);
  const [mostrarCarrito, setMostrarCarrito] = createSignal<boolean>(false);
  const [carrito, setCarrito] = createSignal<{ [id: string]: { producto: Producto, cantidad: number } }>(JSON.parse(localStorage.getItem('carrito') || '{}'));

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  onMount(() => {
    // Función para extraer y guardar el ID del vendedor
    const guardarIdVendedor = async () => {
      // Primero, verifica si ya existe un vendedorId en localStorage
      const existingVendedorId = localStorage.getItem('vendedorId');

      if (existingVendedorId) {
        return; // Si ya existe, no hagas nada
      }

      const pathSegments = window.location.pathname.split('/');
      const linkCode = pathSegments[pathSegments.length - 1]; // Obtiene el último segmento de la URL

      if (linkCode) {
        try {
          const vendedorId = await vendedorService.getVendedorByLink(linkCode);
          if (vendedorId) {
            localStorage.setItem('vendedorId', vendedorId.toString());
          }
        } catch (error) {
          console.error('Error al obtener el ID de vendedor:', error);
        }
      } else {
        console.log('No se encontró el código de enlace en la URL.');
      }
    };

    guardarIdVendedor();
  });

  return (
    <div class="home-container">
      <Header />
      <Banner />
      <div class="main-content">
        <CategoryList onSelectCategory={handleSelectCategory} activeCategoryId={selectedCategoryId()} />
        <div class="content">
          <ProductList 
            selectedCategoryId={selectedCategoryId()} 
            carrito={carrito()} 
            setCarrito={setCarrito} 
            setMostrarCarrito={setMostrarCarrito} 
          />
        </div>
      </div>
      <CartButton 
        mostrarCarrito={mostrarCarrito} 
        setMostrarCarrito={setMostrarCarrito} 
        carrito={carrito} 
        setCarrito={setCarrito} 
      />
    </div>
  );
};

export default App;