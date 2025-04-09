/* @jsxImportSource solid-js */
import { createSignal, onMount, Show } from "solid-js";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import BannerComponent from "./components/Banner"; 
import CartButton from "./components/CartButton";
import ProductDetails from "./components/ProductDetails";
import { Producto } from "./interfaces/Producto";
import {vendedorService} from "./services/vendedorService";

const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = createSignal<number>(0);
  const [mostrarCarrito, setMostrarCarrito] = createSignal<boolean>(false);
  const [carrito, setCarrito] = createSignal<{ [id: string]: { producto: Producto, cantidad: number } }>(JSON.parse(localStorage.getItem('carrito') || '{}'));
  const [searchQuery, setSearchQuery] = createSignal<string>("");
  const [selectedProduct, setSelectedProduct] = createSignal<null | Producto>(null);

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProductClick = (product: Producto) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  onMount(() => {
    const guardarIdVendedor = async () => {
      const existingVendedorId = localStorage.getItem('vendedorId');
      if (existingVendedorId) {
        return;
      }
      const pathSegments = window.location.pathname.split('/');
      const linkCode = pathSegments[pathSegments.length - 1];
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
      <BannerComponent />
      <div class="main-content">
        <CategoryList onSelectCategory={handleSelectCategory} activeCategoryId={selectedCategoryId()} />
        <div class="content">
          <ProductList
            selectedCategoryId={selectedCategoryId()}
            carrito={carrito()}
            setCarrito={setCarrito}
            setMostrarCarrito={setMostrarCarrito}
            searchQuery={searchQuery()}
            onProductDblClick={handleProductClick}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <CartButton
        mostrarCarrito={mostrarCarrito}
        setMostrarCarrito={setMostrarCarrito}
        carrito={carrito}
        setCarrito={setCarrito}
      />
      <Show when={selectedProduct()} fallback={<></>}>
        <ProductDetails product={selectedProduct() as Producto} onClose={handleCloseModal} />
      </Show>
    </div>
  );
};

export default App;