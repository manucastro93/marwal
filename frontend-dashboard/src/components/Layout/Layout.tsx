import { Component, createSignal, onMount, JSX } from "solid-js";
import { usuarioService } from '../../services/usuarioService';
import { authService } from '../../services/authService';
import paginaService from '../../services/paginaService';
import Sidebar from './Sidebar'; 

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
          {logoUrl() ? <img src={logoUrl()} alt="Logo" width="300" /> : "LOGO"}
        </div>
        <div class="panel-admin">Panel Administrativo</div>
        <div class="user-info">
          <span class="username">{usuario()}</span>
          <button class="btn btn-outline-danger" type="button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>
      <main class="main-content d-flex">
        <Sidebar/> {}
        <section class="content p-3" style="flex: 1;">
          {props.children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
