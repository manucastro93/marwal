import { Router, Route } from '@solidjs/router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Vendedores from './pages/Vendedores';
import Pedidos from './pages/Pedidos';
import Pagina from './pages/Pagina';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Notification from './components/Notification';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Notification />
        <Router>
          <Route path="/login" component={Login} />
          
          {/* Rutas protegidas con dashboard layout */}
          <Route path="/home" component={() => <ProtectedRoute component={Home} />} /> 
          <Route path="/productos" component={() => <ProtectedRoute component={Productos} />} />
          <Route path="/categorias" component={() => <ProtectedRoute component={Categorias} />} />
          <Route path="/vendedores" component={() => <ProtectedRoute component={Vendedores} />} />
          <Route path="/pedidos" component={() => <ProtectedRoute component={Pedidos} />} />
          <Route path="/pagina" component={() => <ProtectedRoute component={Pagina} />} />
          <Route path="/clientes" component={() => <ProtectedRoute component={Clientes} />} />
          
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
    </AuthProvider>
  );
};

export default App;