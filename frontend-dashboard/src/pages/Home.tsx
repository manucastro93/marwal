import { Component, createSignal, onMount } from "solid-js";
import Layout from "../components/Layout/Layout";
import { pedidoService } from "../services/pedidoService";
import { Pedido } from "../interfaces/Pedido";

const Home: Component = () => {
  const [pendingOrders, setPendingOrders] = createSignal<Pedido[]>([]);
  const [inProcessOrders, setInProcessOrders] = createSignal<Pedido[]>([]);

  onMount(async () => {
    try {
      const pending = await pedidoService.obtenerPedidosPorEstado('pending');
      const inProcess = await pedidoService.obtenerPedidosPorEstado('in-process');

      setPendingOrders(pending);
      setInProcessOrders(inProcess);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  });

  return (
    <Layout>
      <h1>Pedidos Pendientes y en Proceso</h1>
      <div>
        <h2>Pedidos Pendientes</h2>
        <ul class="orders-list">
          {pendingOrders().map(order => (
            <li class="order-item">{order.detalles[0]?.producto_id} - {order.estado}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Pedidos en Proceso</h2>
        <ul class="orders-list">
          {inProcessOrders().map(order => (
            <li class="order-item">{order.detalles[0]?.producto_id} - {order.estado}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Total de Pedidos del Mes</h2>
      </div>
    </Layout>
  );
};

export default Home;