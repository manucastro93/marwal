import { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import authService from '../services/authService';
import { showNotification } from '../components/Notification';

const Login: Component = () => {
  const [usuario, setUsername] = createSignal('');
  const [contraseña, setPassword] = createSignal('');

  const handleLogin = async () => {
    try {
      const response = await authService.login(usuario(), contraseña());
      // Manejar la respuesta de autenticación
      console.log('Login exitoso:', response);
      window.location.href = '/productos';
    } catch (error) {
      console.error('Error en el login:', error);
      showNotification('Error en el login', 'error');
    }
  };

  return (
    <div class="container">
      <h1>Login</h1>
      <div class="mb-3">
        <label for="usuario" class="form-label">Usuario</label>
        <input type="text" class="form-control" id="usuario" onInput={(e) => setUsername(e.currentTarget.value)} />
      </div>
      <div class="mb-3">
        <label for="contraseña" class="form-label">Contraseña</label>
        <input type="password" class="form-control" id="contraseña" onInput={(e) => setPassword(e.currentTarget.value)} />
      </div>
      <button class="btn btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};

export default Login;