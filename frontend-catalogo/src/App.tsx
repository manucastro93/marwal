/* @jsxImportSource solid-js */
import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import CartButton from "./components/CartButton";

const App = () => {
  return (
    <div>
      <Header />
      <Banner />
      <ProductList />
      <CartButton />
    </div>
  );
};

export default App;