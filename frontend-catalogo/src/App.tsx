/* @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import Banner from "./components/Banner";
import CartButton from "./components/CartButton";
import { Producto } from "./interfaces/Producto"; // Importar Producto

const App = () => {
  const [selectedCategoryId, setSelectedCategoryId] = createSignal<number>(0);
  const [mostrarCarrito, setMostrarCarrito] = createSignal<boolean>(false);
  const [carrito, setCarrito] = createSignal<{ [id: string]: { producto: Producto, cantidad: number } }>(JSON.parse(localStorage.getItem('carrito') || '{}'));

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

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