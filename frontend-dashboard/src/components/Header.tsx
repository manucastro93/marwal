import { Component } from 'solid-js';
import authService from '../services/authService';

const Header: Component = () => {
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