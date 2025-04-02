/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import CheckoutForm from "./CheckoutForm";
import { Producto } from "../interfaces/Producto";

const CartButton = () => {
  const [carrito, setCarrito] = createSignal<Producto[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = createSignal(false);

  const toggleCart = () => {
    setMostrarCarrito(!mostrarCarrito());
  };

  onMount(() => {
    const storedCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(storedCarrito);
  });

  return (
    <div>
      <button class="cart-button" onClick={toggleCart}>🛒</button>
      {mostrarCarrito() && (
        <div class="cart-details">
          <h2>Carrito</h2>
          {carrito().length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            carrito().map((item) => (
              <div>
                <p>{item.nombre}</p>
                <p>{item.descripcion}</p>
              </div>
            ))
          )}
          <CheckoutForm />
        </div>
      )}
    </div>
  );
};

export default CartButton;