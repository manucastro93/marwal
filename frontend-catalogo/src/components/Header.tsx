/* @jsxImportSource solid-js */
import { createSignal, onMount } from 'solid-js';
import { paginaService } from '../services/paginaService';

interface HeaderProps {
  onIrAMisPedidos: () => void;
  onVolverInicio: () => void;
}

const Header = (props: HeaderProps) => {
  const [logoUrl, setLogoUrl] = createSignal("");

  onMount(async () => {
    try {
      const logo = await paginaService.obtenerLogo();
      setLogoUrl(logo.url);
    } catch (error) {
      console.error('=> Error al obtener logo activos:', error);
    }
  });

  return (
    <header class="header">
      <div class="logo-container" onClick={props.onVolverInicio} style={{ cursor: 'pointer' }}>
        {logoUrl() ? (
          <img src={logoUrl()} alt="Logo" class="logo-image" />
        ) : (
          "LOGO"
        )}
        <h1 class="catalogo-online">Catálogo <span>Online</span></h1>
      </div>
      <nav>
        <button class="btn-pedidos" onClick={props.onIrAMisPedidos}>Mis Pedidos</button>
      </nav>
    </header>
  );
};

export default Header;
