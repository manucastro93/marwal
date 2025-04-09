import { Component, For } from 'solid-js';
import { A } from '@solidjs/router';
import { useAuth } from '../../context/AuthContext';

const Sidebar: Component = () => {
  const userRole = useAuth().rol;
  console.log("rol: ",userRole)
  const menuItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Usuarios', href: '/usuarios', roles: ['administrador','supremo'] },
    { label: 'Página', href: '/pagina', roles: ['administrador','supremo'] },
    { label: 'Productos', href: '/productos' },
    { label: 'Pedidos', href: '/pedidos' },
    { label: 'Clientes', href: '/clientes', roles: ['administrador','supremo'] },
    { label: 'Categorías', href: '/categorias', roles: ['administrador','supremo'] },
    { label: 'Vendedores', href: '/vendedores', roles: ['administrador','supremo'] },
    { label: 'Administradores', href: '/administradores', roles: ['supremo'] },
  ];

  const isAllowed = (item: { roles?: string[] }) =>
    !item.roles || item.roles.includes(userRole);

  return (
    <div class="sidebar">
      <nav class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <span class="fs-4">Admin Panel</span>
        </a>
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
    </div>
  );
};

export default Sidebar;
