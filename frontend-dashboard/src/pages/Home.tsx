import { Component } from "solid-js";
import Layout from "../components/Layout";

const Home: Component = () => {

  return (
    <Layout>
      <h1>Pedidos Pendientes y en Proceso</h1>
      <ul class="orders-list">
        <li class="order-item">Pedido 1 - Pendiente</li>
        <li class="order-item">Pedido 2 - En Proceso</li>
        <li class="order-item">Pedido 3 - Pendiente</li>
      </ul>
    </Layout>
  );
};

export default Home;