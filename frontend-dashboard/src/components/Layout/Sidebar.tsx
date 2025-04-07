import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const Sidebar: Component = () => {
  const auth = useAuth();
  const userRole = auth.user()?.rol;

  return (
    <nav class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span class="fs-4">Admin Panel</span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <A href="/" class="nav-link link-dark">Dashboard</A>
        </li>
        {userRole !== 'vendedor' && (
          <>
            <li>
              <A href="/usuarios" class="nav-link link-dark">Usuarios</A>
            </li>
            <li>
              <A href="/pagina" class="nav-link link-dark">Página</A>
            </li>
          </>
        )}
        <li>
          <A href="/productos" class="nav-link link-dark">Productos</A>
        </li>
        <li>
          <A href="/pedidos" class="nav-link link-dark">Pedidos</A>
        </li>
        <li>
          <A href="/clientes" class="nav-link link-dark">Clientes</A>
        </li>
        <li>
          <A href="/categorias" class="nav-link link-dark">Categorías</A>
        </li>
        <li>
          <A href="/vendedores" class="nav-link link-dark">Vendedores</A>
        </li>
        <li>
          <A href="/administradores" class="nav-link link-dark">Administradores</A>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;