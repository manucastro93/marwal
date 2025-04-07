import { Component, createSignal, onMount, JSX } from "solid-js";
import { usuarioService } from '../../services/usuarioService';
import { authService } from '../../services/authService';
import paginaService from '../../services/paginaService';
import { BASE_URL } from '../../config';

interface LayoutProps {
  children: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  const [usuario, setUsername] = createSignal("");
  const [logoUrl, setLogoUrl] = createSignal("");
  onMount(async () => {
    try {
      const user = await usuarioService.obtenerUsuarioConectado();
      setUsername(user.usuario);
      const logo = await paginaService.obtenerLogo();
      setLogoUrl(logo.url);
    } catch (error) {
      console.error("Error al obtener el usuario actual o logo:", error);
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
    <div class="home-container">
      <header class="header">
        <div class="logo">
          {logoUrl() ? <img src={BASE_URL+logoUrl()} alt="Logo" width="300" /> : "LOGO"}
        </div>
        <div class="panel-admin">Panel Administrativo</div>
        <div class="user-info">
          <span class="username">{usuario()}</span>
          <button class="btn btn-outline-danger" type="button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>
      <main class="main-content">
        <aside class="sidebar">
          <ul class="sidebar-list">
            <li class="sidebar-item"><a href="/productos" class="sidebar-link">Productos</a></li>
            <li class="sidebar-item"><a href="/categorias" class="sidebar-link">Categorías</a></li>
            <li class="sidebar-item"><a href="/vendedores" class="sidebar-link">Vendedores</a></li>
            <li class="sidebar-item"><a href="/pedidos" class="sidebar-link">Pedidos</a></li>
            <li class="sidebar-item"><a href="/clientes" class="sidebar-link">Clientes</a></li>
            <li class="sidebar-item"><a href="/pagina" class="sidebar-link">Página</a></li>
          </ul>
        </aside>
        <section class="content">
          {props.children}
        </section>
      </main>
    </div>
  );
};

export default Layout;