import { Router, Route } from "@solidjs/router";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Vendedores from "./pages/Vendedores";
import Pedidos from "./pages/Pedidos";
import Pagina from "./pages/Pagina";
import Home from "./pages/Home";  // Importar la nueva página Home

const App = () => {
  return (
      <Router>
        <Route path="/login" component={Login} />
        
        {/* Rutas protegidas con dashboard layout */}
        <Route path="/home" component={Home} />  {/* Agregar la ruta para Home */}
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
  );
};

export default App;