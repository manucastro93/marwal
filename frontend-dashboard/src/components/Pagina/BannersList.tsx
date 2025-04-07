import { createSignal, onMount } from 'solid-js';
import paginaService from '../../services/paginaService';
import { Banner } from '../../interfaces/Pagina';

const BannersList = () => {
  const [banners, setBanners] = createSignal<Banner[]>([]);

  onMount(async () => {
    const data = await paginaService.obtenerBanners();
    setBanners(data);
  });

  return (
    <div>
      <h1>Lista de Banners</h1>
      <ul>
        {banners().map(banner => (
          <li>{banner.url}</li>
        ))}
      </ul>
    </div>
  );
};

export default BannersList;