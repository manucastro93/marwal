/* @jsxImportSource solid-js */
import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { pedidoService } from '../services/pedidoService';
import { Producto } from '../interfaces/Producto';

interface CheckoutFormProps {
  carrito: { [id: string]: { producto: Producto; cantidad: number } };
  setCarrito: (carrito: { [id: string]: { producto: Producto; cantidad: number } }) => void;
  setMostrarCarrito: (visible: boolean) => void;
}

const CheckoutForm: Component<CheckoutFormProps> = (props) => {
  const [cliente, setCliente] = createSignal({
    nombre: '',
    email: '',
    telefono: '',
    cuit_cuil: '',
    direccion: '',
    localidad: '',
    provincia: '',
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCliente({ ...cliente(), [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const detalles = Object.values(props.carrito).map(({ producto, cantidad }) => ({
      producto_id: producto.id,
      cantidad,
      precio: producto.precio,
    }));

    try {
      await pedidoService.crearPedido({
        cliente: {
          nombre: cliente().nombre,
          email: cliente().email,
          telefono: cliente().telefono,
        },
        detalles,
      });

      alert('¡Pedido enviado con éxito!');
      props.setCarrito({});
      localStorage.removeItem('carrito');
      props.setMostrarCarrito(false);
    } catch (err) {
      alert('Error al enviar pedido');
      console.error(err);
    }
  };

  return (
    <form class="checkout-form" onSubmit={handleSubmit}>
      <h3>Datos del Cliente</h3>
      <input type="text" name="nombre" placeholder="Nombre" value={cliente().nombre} onInput={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={cliente().email} onInput={handleChange} required />
      <input type="tel" name="telefono" placeholder="Teléfono" value={cliente().telefono} onInput={handleChange} required />
      <input type="text" name="cuit_cuil" placeholder="CUIT/CUIL" value={cliente().cuit_cuil} onInput={handleChange} />
      <input type="text" name="direccion" placeholder="Dirección" value={cliente().direccion} onInput={handleChange} />
      <input type="text" name="localidad" placeholder="Localidad" value={cliente().localidad} onInput={handleChange} />
      <input type="text" name="provincia" placeholder="Provincia" value={cliente().provincia} onInput={handleChange} />
      <button type="submit" class="submit-button">Confirmar pedido</button>
    </form>
  );
};

export default CheckoutForm;
