/* @jsxImportSource solid-js */
import { onMount, createEffect, Accessor, onCleanup } from "solid-js";
import CheckoutForm from "./CheckoutForm";
import { Producto } from "../interfaces/Producto";

interface CartButtonProps {
  mostrarCarrito: Accessor<boolean>;
  carrito: Accessor<{ [id: string]: { producto: Producto, cantidad: number } }>;
  setCarrito: (value: { [id: string]: { producto: Producto, cantidad: number } }) => void;
  setMostrarCarrito: (value: boolean) => void;
}

const CartButton = (props: CartButtonProps) => {
  let cartDetailsRef: HTMLDivElement;

  onMount(() => {
    if (props.mostrarCarrito()) {
      props.setMostrarCarrito(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (cartDetailsRef && !cartDetailsRef.contains(event.target as Node)) {
        props.setMostrarCarrito(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  createEffect(() => {
    if (props.mostrarCarrito()) {
      props.setMostrarCarrito(true);
    }
  });

  const toggleCart = () => {
    props.setMostrarCarrito(!props.mostrarCarrito());
  };

  const removeFromCart = (id: string) => {
    let newCarrito = { ...props.carrito() };
    delete newCarrito[id];
    localStorage.setItem('carrito', JSON.stringify(newCarrito));
    props.setCarrito(newCarrito);
  };

  const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
  };

  const calculateTotal = (producto: Producto, cantidad: number) => {
    return producto.precio * cantidad;
  };

  const calculateCartTotal = () => {
    return Object.values(props.carrito()).reduce((total, { producto, cantidad }) => {
      return total + calculateTotal(producto, cantidad);
    }, 0);
  };

  return (
    <div class={`cart-button-container ${props.mostrarCarrito() ? 'show' : ''}`}>
      <button class="cart-button" onClick={toggleCart}>🛒</button>
      {props.mostrarCarrito() && (
        <div class="cart-details" ref={el => cartDetailsRef = el}>
          <h2>Carrito</h2>
          {isEmpty(props.carrito()) ? (
            <p>No hay productos en el carrito</p>
          ) : (
            <>
              <table class="cart-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(props.carrito()).map(({ producto, cantidad }) => (
                    producto && (
                      <tr>
                        <td>{producto.codigo}</td>
                        <td>{producto.nombre}</td>
                        <td>{cantidad}</td>
                        <td>${calculateTotal(producto, cantidad).toFixed(2)}</td>
                        <td>
                          <button class="delete-button" onClick={() => removeFromCart(producto.id.toString())}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M3 6h18v2H3zm3 0V5c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v1h4V5c0-1.1-.9-2-2-2h-4.18C12.4 2.84 11.3 2 10 2H8C6.9 2 6 2.9 6 4v2zm6 14c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1zm4-1c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1zm-8 0c-.55 0-1-.45-1-1v-9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1z"/></svg>
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
              <div class="cart-total">
                <h3>Total: ${calculateCartTotal().toFixed(2)}</h3>
              </div>
            </>
          )}
          <CheckoutForm />
        </div>
      )}
    </div>
  );
};

export default CartButton;