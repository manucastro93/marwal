/* @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount, For } from "solid-js";
import paginaService from "../services/paginaService"; 
import { Banner } from "../interfaces/Banner";

const BannerComponent = () => {
  const [banners, setBanners] = createSignal<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = createSignal(0);
  const fetchBanners = async () => {
    try {
      const response = await paginaService.obtenerBannersActivos();
      setBanners(response);
    } catch (error) {
      console.error('=> Error al obtener banners activos:', error);
    }
  };

  const nextBanner = () => {
    setCurrentBanner((currentBanner() + 1) % banners().length);
  };

  const interval = setInterval(nextBanner, 3000);

  onCleanup(() => clearInterval(interval));

  onMount(() => {
    fetchBanners();
  });

  return (
    <div class="banner-slider">
      <For each={banners()}>
        {(banner, index) => (
          <img src={banner.url} alt={`Banner ${index() + 1}`} style={{ display: currentBanner() === index() ? 'block' : 'none' }} />
        )}
      </For>
    </div>
  );
};

export default BannerComponent;