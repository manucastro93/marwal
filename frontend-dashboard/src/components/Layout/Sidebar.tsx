import { Component, For } from 'solid-js';
import { A } from '@solidjs/router';
import { useAuth } from '../../context/AuthContext';

const Sidebar: Component = () => {
  const userRole = localStorage.getItem('userRole');
  const menuItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Productos', href: '/productos' },
    { label: 'Pedidos', href: '/pedidos' },
    { label: 'Clientes', href: '/clientes', roles: ['administrador','supremo'] },
    { label: 'Categorías', href: '/categorias', roles: ['administrador','supremo'] },
    { label: 'Vendedores', href: '/vendedores', roles: ['administrador','supremo'] },
    { label: 'Usuarios', href: '/usuarios', roles: ['administrador','supremo'] },
    { label: 'Administradores', href: '/administradores', roles: ['supremo'] },
    { label: 'Página', href: '/pagina', roles: ['administrador','supremo'] },
  ];

  const isAllowed = (item: { roles?: string[] }) =>
    !item.roles || item.roles.includes(userRole);

  return (
      <nav class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
        <hr />
        <ul class="nav nav-pills flex-column mb-auto">
          <For each={menuItems.filter(isAllowed)}>
            {(item) => (
              <li class="nav-item">
                <A href={item.href} class="nav-link link-dark">
                  {item.label}
                </A>
              </li>
            )}
          </For>
        </ul>
      </nav>
  );
};

export default Sidebar;
