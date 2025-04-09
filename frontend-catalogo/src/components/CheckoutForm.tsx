/* @jsxImportSource solid-js */
import { createSignal, Show } from 'solid-js';
import { pedidoService } from '../services/pedidoService';
import { Cliente, DetallePedido, Pedido } from '../interfaces/Pedido';
import '../styles/CheckoutForm.css';

const CheckoutForm = () => {
  const [cliente, setCliente] = createSignal<Cliente>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    cuit_cuil: '',
  });

  const [carrito, setCarrito] = createSignal<{ [id: string]: { producto: any, cantidad: number } }>(
    JSON.parse(localStorage.getItem('carrito') || '{}')
  );

  const [enviando, setEnviando] = createSignal(false);
  const [mensaje, setMensaje] = createSignal('');
  const [pedidoCreado, setPedidoCreado] = createSignal<Pedido | null>(null);

  const handleInputChange = (field: keyof Cliente, value: string) => {
    setCliente({ ...cliente(), [field]: value });
  };

  const handleSubmit = async () => {
    setEnviando(true);
    setMensaje('');

    try {
      const detalles: DetallePedido[] = Object.values(carrito()).map(({ producto, cantidad }) => ({
        producto_id: producto.id,
        cantidad,
        precio_unitario: producto.precio,
      }));

      const payload = {
        cliente: cliente(),
        detalles,
      };

      const pedido = await pedidoService.crearPedido(payload);
      setPedidoCreado(pedido);
      setMensaje('✅ Pedido creado correctamente');
      localStorage.removeItem('carrito');
      setCarrito({});
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      setMensaje('❌ Error al crear el pedido');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div class="checkout-form-container">
      <h2>Datos del Cliente</h2>

      <div class="form-group">
        <label>Nombre</label>
        <input type="text" value={cliente().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      </div>

      <div class="form-group">
        <label>Apellido</label>
        <input type="text" value={cliente().apellido} onInput={(e) => handleInputChange('apellido', e.currentTarget.value)} />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" value={cliente().email} onInput={(e) => handleInputChange('email', e.currentTarget.value)} />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input type="tel" value={cliente().telefono} onInput={(e) => handleInputChange('telefono', e.currentTarget.value)} />
      </div>

      <div class="form-group">
        <label>Dirección</label>
        <input type="text" value={cliente().direccion} onInput={(e) => handleInputChange('direccion', e.currentTarget.value)} />
      </div>

      <div class="form-group">
        <label>CUIT / CUIL</label>
        <input type="text" value={cliente().cuit_cuil} onInput={(e) => handleInputChange('cuit_cuil', e.currentTarget.value)} />
      </div>

      <button class="submit-button" disabled={enviando()} onClick={handleSubmit}>
        {enviando() ? 'Enviando...' : 'Finalizar Pedido'}
      </button>

      <Show when={mensaje()}>
        <p class="mensaje">{mensaje()}</p>
      </Show>

      <Show when={pedidoCreado()}>
        <div class="pedido-resumen">
          <h3>Pedido realizado</h3>
          <p>ID: {pedidoCreado()?.id}</p>
          <p>Fecha: {pedidoCreado()?.createdAt}</p>
        </div>
      </Show>
    </div>
  );
};

export default CheckoutForm;
