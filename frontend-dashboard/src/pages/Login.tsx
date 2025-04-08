import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../components/Layout/Notification';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = createSignal('');
  const [contraseña, setContraseña] = createSignal('');

  const handleLogin = async () => {
    try {
      await login(usuario(), contraseña());
      navigate('/home');
      window.location.href ="/home";
    } catch (error) {
      console.error('Error en el login:', error);
      showNotification('Error en el login', 'error');
    }
  };

  return (
    <div class="container">
      <div class="login-form">
        <h1>Login</h1>
        <div class="mb-3">
          <label for="usuario" class="form-label">Usuario</label>
          <input type="text" class="form-control" id="usuario" onInput={(e) => setUsuario(e.currentTarget.value)} />
        </div>
        <div class="mb-3">
          <label for="contraseña" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="contraseña" onInput={(e) => setContraseña(e.currentTarget.value)} />
        </div>
        <button class="btn btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Login;