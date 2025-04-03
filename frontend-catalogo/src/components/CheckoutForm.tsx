/* @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { placePedido, placePedidoConDetalles } from "../services/PedidoService"; // Importar las funciones necesarias
import { saveCliente } from "../services/ClienteService";
import { Pedido } from "../interfaces/Pedido";
import { Cliente } from "../interfaces/Cliente";
import { DetallePedido } from "../interfaces/DetallePedido"; // Importar la interfaz DetallePedido

const CheckoutForm = () => {
  const [nombre, setNombre] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [cuit, setCuit] = createSignal('');
  const [telefono, setTelefono] = createSignal('');
  const [direccion, setDireccion] = createSignal('');
  const [localidad, setLocalidad] = createSignal('');
  const [provincia, setProvincia] = createSignal('');

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const vendedorId = localStorage.getItem('vendedorId');

    const cliente: Cliente = {
      nombre: nombre(),
      email: email(),
      telefono: telefono(),
      cuit_cuil: cuit(),
      dirección: direccion(),
      localidad: localidad(),
      provincia: provincia(),
      ip: '192.168.1.1',
      vendedor_id: vendedorId ? parseInt(vendedorId) : null,
    };

    const savedCliente = await saveCliente(cliente);

    // Crear el pedido sin los detalles
    const pedido: Pedido = {
      cliente_id: savedCliente.id!,
      vendedor_id: vendedorId ? parseInt(vendedorId) : 0, // Asignar 0 si es null
    };

    // Obtener el carrito desde el localStorage
    let carrito = {};
    try {
      carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
      console.log('Parsed carrito:', carrito);
      if (typeof carrito !== 'object' || carrito === null) {
        throw new Error("Carrito is not an object");
      }
    } catch (error) {
      console.error("Error parsing carrito from localStorage:", error);
      alert("Error al procesar el carrito. Por favor, inténtelo de nuevo.");
      return;
    }

    // Crear los detalles del pedido sin el pedido_id
    const detalles = Object.values(carrito).map((item: any) => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad,
      precio: item.producto.precio,
    }));

    try {
      // Guardar el pedido y obtener el pedido_id
      const savedPedido = await placePedido(pedido);

      if (!savedPedido.id) {
        throw new Error('Failed to save pedido: ID is not defined');
      }

      // Agregar pedido_id a cada detalle
      const detallesConPedidoId: DetallePedido[] = detalles.map(detalle => ({
        ...detalle,
        pedido_id: savedPedido.id!
      }));

      // Guardar los detalles del pedido
      await placePedidoConDetalles(savedPedido.id, detallesConPedidoId);

    } catch (error) {
      console.error("Error saving pedido:", error);
      alert("Error al guardar el pedido. Por favor, inténtelo de nuevo.");
      return;
    }

    // Limpiar el carrito después de enviar el pedido correctamente
    localStorage.removeItem('carrito');

    // Abrir WhatsApp en una nueva ventana
    window.open(`https://wa.me/1130544702?text=Pedido%20de%20${nombre()}`, '_blank');

    // Recargar la página después de un pequeño retraso para asegurarse de que el enlace de WhatsApp se abra
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={nombre()} onInput={(e) => setNombre((e.target as HTMLInputElement).value)} required />
      <input type="email" placeholder="Email" value={email()} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="CUIT o CUIL" value={cuit()} onInput={(e) => setCuit((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="Teléfono" value={telefono()} onInput={(e) => setTelefono((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="Dirección" value={direccion()} onInput={(e) => setDireccion((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="Localidad" value={localidad()} onInput={(e) => setLocalidad((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="Provincia" value={provincia()} onInput={(e) => setProvincia((e.target as HTMLInputElement).value)} required />
      <button type="submit">Finalizar Pedido</button>
    </form>
  );
};

export default CheckoutForm;