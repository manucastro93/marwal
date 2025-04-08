import { createSignal, onMount } from 'solid-js';
import paginaService from '../services/paginaService';

const Header = () => {
  const [logoUrl, setLogoUrl] = createSignal("");
  onMount(async () => {
    try {
      const response = await paginaService.obtenerLogo();
      setLogoUrl(logo.url);
    } catch (error) {
      console.error('=> Error al obtener logo activos:', error);
    }
  });

  return (
    <header class="header">
      {logoUrl() ? <img src={logoUrl()} alt="Logo" class="logo-image" /> : "LOGO"}
      <h1 class="catalogo-online">Catálogo <span>Online</span></h1>
    </header>
  );
};

export default Header;