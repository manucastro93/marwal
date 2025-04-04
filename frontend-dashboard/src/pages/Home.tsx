import { Component, createSignal, onMount } from "solid-js";
import Layout from "../components/Layout";
import orderService from "../services/orderService";
import { Pedido } from "../interfaces/Pedido";

const Home: Component = () => {
  const [pendingOrders, setPendingOrders] = createSignal<Pedido[]>([]);
  const [inProcessOrders, setInProcessOrders] = createSignal<Pedido[]>([]);
  const [totalOrdersThisMonth, setTotalOrdersThisMonth] = createSignal<number>(0);

  onMount(async () => {
    try {
      const pending = await orderService.getOrdersByStatus('pending');
      const inProcess = await orderService.getOrdersByStatus('in-process');
      const totalThisMonth = await orderService.getTotalOrdersThisMonth();

      setPendingOrders(pending);
      setInProcessOrders(inProcess);
      setTotalOrdersThisMonth(totalThisMonth);
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
        <p>{totalOrdersThisMonth()}</p>
      </div>
    </Layout>
  );
};

export default Home;