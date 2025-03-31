import { Component } from 'solid-js';
import { NavLink } from '@solidjs/router';

const Sidebar: Component = () => {
  return (
    <nav class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <span class="fs-4">Admin Panel</span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <NavLink href="/" class="nav-link link-dark">Dashboard</NavLink>
        </li>
        <li>
          <NavLink href="/usuarios" class="nav-link link-dark">Usuarios</NavLink>
        </li>
        <li>
          <NavLink href="/productos" class="nav-link link-dark">Productos</NavLink>
        </li>
        <li>
          <NavLink href="/pedidos" class="nav-link link-dark">Pedidos</NavLink>
        </li>
        <li>
          <NavLink href="/clientes" class="nav-link link-dark">Clientes</NavLink>
        </li>
        <li>
          <NavLink href="/categorias" class="nav-link link-dark">Categorías</NavLink>
        </li>
        <li>
          <NavLink href="/pagina" class="nav-link link-dark">Página</NavLink>
        </li>
        <li>
          <NavLink href="/vendedores" class="nav-link link-dark">Vendedores</NavLink>
        </li>
        <li>
          <NavLink href="/administradores" class="nav-link link-dark">Administradores</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;