import { createSignal, createEffect } from 'solid-js';
import paginaService from '../services/paginaService';

const Header = () => {
  const [logo, setLogo] = createSignal<any[]>([]);
  const fetchLogo = async () => {
    try {
      const response = await paginaService.obtenerLogo();
      setLogo(response);
      console.log(response)
    } catch (error) {
      console.error('=> Error al obtener logo activos:', error);
    }
  };
  createEffect(() => {
    fetchLogo();
  });
  return (
    <header class="header">
      <img src={''} alt="Logo" class="logo-image" />
      <h1 class="catalogo-online">Catálogo <span>Online</span></h1>
    </header>
  );
};

export default Header;