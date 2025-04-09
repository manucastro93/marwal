import { createSignal } from 'solid-js';
import { pedidoService } from '../services/pedidoService';
import { CrearPedidoPayload } from '../interfaces/Pedido';

const CheckoutForm = () => {
  const [nombre, setNombre] = createSignal('');
  const [telefono, setTelefono] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [carrito, setCarrito] = createSignal([
    // Ejemplo de estructura del carrito
    // { producto_id: 1, cantidad: 2, precio: 100 }
  ]);
  const [mensaje, setMensaje] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const payload: CrearPedidoPayload = {
      cliente: {
        nombre: nombre(),
        telefono: telefono(),
        email: email()
      },
      detalles: carrito()
    };

    try {
      const pedido = await pedidoService.crearPedido(payload);
      setMensaje(`¡Pedido creado con éxito! ID: ${pedido.id}`);
      setCarrito([]); // limpiar carrito
    } catch (error: any) {
      setMensaje(`Error al crear el pedido: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Finalizar Pedido</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre()}
        onInput={(e) => setNombre(e.currentTarget.value)}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono()}
        onInput={(e) => setTelefono(e.currentTarget.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <button type="submit">Confirmar Pedido</button>
      <p>{mensaje()}</p>
    </form>
  );
};

export default CheckoutForm;
