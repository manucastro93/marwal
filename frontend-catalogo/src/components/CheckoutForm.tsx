import { createSignal } from 'solid-js';
import { Cliente } from '../interfaces/Cliente';
import { crearPedido } from '../services/pedidoService';
import { useCarrito } from '../context/CarritoContext';

const CheckoutForm = () => {
  const { carrito, limpiarCarrito } = useCarrito();

  const [cliente, setCliente] = createSignal<Cliente>({
    nombre: '',
    email: '',
    telefono: '',
    cuit_cuil: '',
    direccion: '',
    localidad: '',
    provincia: '',
  });

  const handleInput = (e: Event) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const payload = {
        cliente: {
          nombre: cliente().nombre,
          email: cliente().email,
          telefono: cliente().telefono,
        },
        detalles: carrito().map(({ producto, cantidad }) => ({
          producto_id: producto.id,
          cantidad,
          precio: producto.precio,
        })),
      };

      await crearPedido(payload);
      alert('¡Pedido enviado con éxito!');
      limpiarCarrito();
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Ocurrió un error al crear el pedido.');
    }
  };

  return (
    <form class="checkout-form" onSubmit={handleSubmit}>
      <h2>Datos del Cliente</h2>

      <div class="form-group">
        <label>Nombre</label>
        <input type="text" name="nombre" value={cliente().nombre} onInput={handleInput} required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value={cliente().email} onInput={handleInput} />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input type="tel" name="telefono" value={cliente().telefono} onInput={handleInput} />
      </div>

      <div class="form-group">
        <label>CUIT / CUIL</label>
        <input type="text" name="cuit_cuil" value={cliente().cuit_cuil} onInput={handleInput} />
      </div>

      <div class="form-group">
        <label>Dirección</label>
        <input type="text" name="direccion" value={cliente().direccion} onInput={handleInput} />
      </div>

      <div class="form-group">
        <label>Localidad</label>
        <input type="text" name="localidad" value={cliente().localidad} onInput={handleInput} />
      </div>

      <div class="form-group">
        <label>Provincia</label>
        <input type="text" name="provincia" value={cliente().provincia} onInput={handleInput} />
      </div>

      <button type="submit" class="btn-submit">Finalizar pedido</button>
    </form>
  );
};

export default CheckoutForm;
