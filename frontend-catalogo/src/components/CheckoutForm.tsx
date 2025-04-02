/* @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { placePedido } from "../services/PedidoService";
import { Pedido } from "../interfaces/Pedido";

const CheckoutForm = () => {
  const [nombre, setNombre] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [cuit, setCuit] = createSignal('');
  const [telefono, setTelefono] = createSignal('');

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const vendedorId = localStorage.getItem('vendedorId');
    const pedido: Pedido = {
      nombre: nombre(),
      email: email(),
      cuit: cuit(),
      telefono: telefono(),
      carrito: JSON.parse(localStorage.getItem('carrito') || '[]'),
      vendedorId: vendedorId || '',
      ip: '192.168.1.1'  // Placeholder para la IP del cliente
    };

    await placePedido(pedido);

    window.location.href = `https://wa.me/1130544702?text=Pedido%20de%20${nombre()}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" value={nombre()} onInput={(e) => setNombre((e.target as HTMLInputElement).value)} required />
      <input type="email" placeholder="Email" value={email()} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="CUIT o CUIL" value={cuit()} onInput={(e) => setCuit((e.target as HTMLInputElement).value)} required />
      <input type="text" placeholder="Teléfono" value={telefono()} onInput={(e) => setTelefono((e.target as HTMLInputElement).value)} required />
      <button type="submit">Finalizar Pedido</button>
    </form>
  );
};

export default CheckoutForm;