import { Component } from "solid-js";
import { Route, Router } from "@solidjs/router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Categorias from "./pages/Categorias";
import Pagina from "./pages/Pagina";
import Vendedores from "./pages/Vendedores";
import Administradores from "./pages/Administradores";
import Login from "./pages/Login";

const App: Component = () => {
  return (
    <div class="d-flex">
      <Sidebar />
      <div class="flex-grow-1">
        <Header />
        <div class="container mt-3">
          <Router>
            <Route path="/" component={Login} />
            <Route path="/productos" component={Productos} />
            <Route path="/pedidos" component={Pedidos} />
            <Route path="/clientes" component={Clientes} />
            <Route path="/categorias" component={Categorias} />
            <Route path="/pagina" component={Pagina} />
            <Route path="/vendedores" component={Vendedores} />
            <Route path="/administradores" component={Administradores} />
          </Router>
        </div>
      </div>
    </div>
  );
};

export default App;
