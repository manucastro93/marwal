import { Component, createSignal, onMount } from "solid-js";
import authService from '../services/authService';

const Header: Component = () => {
  const [usuario, setUsername] = createSignal("");

  onMount(async () => {
    try {
      const user = await authService.getCurrentUser();
      setUsername(user.usuario); // Aquí se usa 'user.usuario' según el campo correcto
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
    }
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Panel Administrativo</a>
        <button class="btn btn-outline-danger" type="button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Header;