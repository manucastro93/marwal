import { Router, Route } from "@solidjs/router";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Vendedores from "./pages/Vendedores";
import Pedidos from "./pages/Pedidos";
import Pagina from "./pages/Pagina";
import Home from "./pages/Home";
import Notification from "./components/Notification";

const App = () => {
  return (
    <div>
      <Notification />
      <Router>
        <Route path="/login" component={Login} />
        
        {/* Rutas protegidas con dashboard layout */}
        <Route path="/home" component={Home} /> 
        <Route path="/productos" component={Productos} />
        <Route path="/categorias" component={Categorias} />
        <Route path="/vendedores" component={Vendedores} />
        <Route path="/pedidos" component={Pedidos} />
        <Route path="/pagina" component={Pagina} />
        
        {/* Ruta por defecto dentro de dashboard */}
        <Route path="/" component={() => {
          window.location.href = "/home";
          return null;
        }} />

        {/* Redirección para rutas no encontradas */}
        <Route path="*" component={() => {
          window.location.href = "/login";
          return null;
        }} />
      </Router>
    </div>
  );
};

export default App;