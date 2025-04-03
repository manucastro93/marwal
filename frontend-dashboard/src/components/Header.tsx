import { Component, createSignal, onMount } from "solid-js";
import authService from '../services/authService';

const Header: Component = () => {
  const [usuario, setUsername] = createSignal("");

  onMount(async () => {
    try {
      const user = await authService.getCurrentUser();
      setUsername(user.usuario);
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
    <header class="header">
        <div class="logo">LOGO</div>
        <div class="panel-admin">Panel Administrativo</div>
        <div class="user-info">
        <span class="username">{usuario()}</span>
        <button class="btn btn-outline-danger" type="button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>
  );
};

export default Header;