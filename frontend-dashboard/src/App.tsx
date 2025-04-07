import { Router, Route } from '@solidjs/router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Vendedores from './pages/Vendedores';
import Pedidos from './pages/Pedidos';
import PedidoDetalle from './components/Pedidos/PedidoDetalle'; // Importar el componente PedidoDetalle
import Pagina from './pages/Pagina';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Notification from './components/Layout/Notification';
import Metrics from './pages/Metricas';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Notification />
        <Router>
          <Route path="/login" component={Login} />
          <Route path="/" component={Login} />
          <Route path="/home" component={() => <ProtectedRoute component={Home} />} /> 
          <Route path="*" component={() => <ProtectedRoute component={Home} />} />
          <Route path="/home" component={() => <ProtectedRoute component={Home} />} />  
          <Route path="/productos" component={() => <ProtectedRoute component={Productos} />} />
          <Route path="/categorias" component={() => <ProtectedRoute component={Categorias} />} />
          <Route path="/vendedores" component={() => <ProtectedRoute component={Vendedores} />} />
          <Route path="/pedidos" component={() => <ProtectedRoute component={Pedidos} />} />
          <Route path="/pedidos/:pedidoId" component={(props) => <ProtectedRoute component={() => <PedidoDetalle pedidoId={props.params.pedidoId} />} />} /> {/* Nueva ruta para PedidoDetalle */}
          <Route path="/pagina" component={() => <ProtectedRoute component={Pagina} />} />
          <Route path="/clientes" component={() => <ProtectedRoute component={Clientes} />} />
        
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;