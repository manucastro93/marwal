/* @jsxImportSource solid-js */
import { createSignal, onMount } from "solid-js";
import { clienteService } from "../services/clienteService";
import { pedidoService } from "../services/pedidoService";
import { ipService } from "../services/ipService";
import { logClienteService } from "../services/logClienteService";
import { Cliente } from "../interfaces/Cliente";
import { Pedido } from "../interfaces/Pedido";
import { DetallePedido } from "../interfaces/Pedido";

const CheckoutForm = () => {
  const [nombre, setNombre] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [cuit, setCuit] = createSignal('');
  const [telefono, setTelefono] = createSignal('');
  const [direccion, setDireccion] = createSignal('');
  const [localidad, setLocalidad] = createSignal('');
  const [provincia, setProvincia] = createSignal('');

  const fetchIpAddress = async (): Promise<string> => {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  };

  onMount(async () => {
    try {
      const ip = await fetchIpAddress();
      const cliente = await clienteService.getClienteByIp(ip);
      if (cliente) {
        setNombre(cliente.nombre);
        setEmail(cliente.email);
        setCuit(cliente.cuit_cuil);
        setTelefono(cliente.telefono);
        setDireccion(cliente.direccion);
        setLocalidad(cliente.localidad);
        setProvincia(cliente.provincia);
      }
    } catch (err) {
      console.error("Error obteniendo cliente por IP:", err);
    }
  });

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const vendedorId = localStorage.getItem("vendedorId");

    try {
      const ip = await fetchIpAddress();

      const cliente: Cliente = {
        nombre: nombre(),
        email: email(),
        telefono: telefono(),
        cuit_cuil: cuit(),
        direccion: direccion(),
        localidad: localidad(),
        provincia: provincia(),
        ip,
        vendedor_id: vendedorId ? parseInt(vendedorId) : null,
      };

      const savedCliente = await clienteService.saveOrUpdateCliente(cliente);

      const pedido: Pedido = {
        cliente_id: savedCliente.id!,
        vendedor_id: vendedorId ? parseInt(vendedorId) : 0,
      };

      const carritoRaw = localStorage.getItem('carrito') || '{}';
      const carrito = JSON.parse(carritoRaw);

      const detalles: DetallePedido[] = Object.values(carrito).map((item: any) => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio
      }));

      const savedPedido = await pedidoService.placePedido(pedido);

      const detallesConPedidoId: DetallePedido[] = detalles.map(detalle => ({
        ...detalle,
        pedido_id: savedPedido.id!
      }));

      await pedidoService.placePedidoConDetalles(savedPedido.id!, detallesConPedidoId);

      await fetch('/api/sendOrderEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido: savedPedido,
          detalles: detallesConPedidoId,
          cliente: savedCliente
        })
      });

      const mensajeWhatsApp = `Pedido de ${nombre()}:\n${detallesConPedidoId
        .map(d => `Producto ID: ${d.producto_id}, Cantidad: ${d.cantidad}, Precio: ${d.precio}`)
        .join('\n')}\nTotal: ${detallesConPedidoId.reduce((acc, d) => acc + d.precio * d.cantidad, 0)}`;

      window.open(`https://wa.me/1130544702?text=${encodeURIComponent(mensajeWhatsApp)}`, '_blank');

      setTimeout(() => {
        localStorage.removeItem('carrito');
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Ocurrió un error al finalizar el pedido.");
    }
  };

  return (
    <form onSubmit={handleSubmit} class="checkout-form">
      <label>Nombre</label>
      <input type="text" value={nombre()} onInput={(e) => setNombre(e.currentTarget.value)} required />
      <label>Email</label>
      <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} required />
      <label>CUIT o CUIL</label>
      <input type="text" value={cuit()} onInput={(e) => setCuit(e.currentTarget.value)} required />
      <label>Teléfono</label>
      <input type="text" value={telefono()} onInput={(e) => setTelefono(e.currentTarget.value)} required />
      <label>Dirección</label>
      <input type="text" value={direccion()} onInput={(e) => setDireccion(e.currentTarget.value)} required />
      <label>Localidad</label>
      <input type="text" value={localidad()} onInput={(e) => setLocalidad(e.currentTarget.value)} required />
      <label>Provincia</label>
      <input type="text" value={provincia()} onInput={(e) => setProvincia(e.currentTarget.value)} required />
      <button type="submit">Finalizar Pedido</button>
    </form>
  );
};

export default CheckoutForm;
