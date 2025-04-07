import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { showNotification } from '../components/Layout/Notification';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = createSignal('');
  const [contraseña, setContraseña] = createSignal('');
  const handleLogin = async () => {
    try {
      const response = await authService.login(usuario(), contraseña());
      console.log('Login exitoso:', response);
      localStorage.setItem('token', response.token); // Guardar el token en localStorage
      login(); // Actualiza el estado de autenticación
      console.log('Antes de redireccionar a /home');
      navigate('/home'); // Redirección al home
      window.location.href= '/home'; // Recargar la página para aplicar el nuevo estado
      console.log('Redireccionando a /home');
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