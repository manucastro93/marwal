/* @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount, For } from "solid-js";
import bannerService from "../services/BannerService"; 
import { Banner } from "../interfaces/Banner";

const BannerComponent = () => {
  const [banners, setBanners] = createSignal<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = createSignal(0);
  const BASE_URL = 'http://localhost:3000';
  const fetchBanners = async () => {
    try {
      const data = await bannerService.getBanners();
      console.log("Banners fetched:", data); // Log de los banners obtenidos
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
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
          <img src={BASE_URL+banner.url} alt={`Banner ${index() + 1}`} style={{ display: currentBanner() === index() ? 'block' : 'none' }} />
        )}
      </For>
    </div>
  );
};

export default BannerComponent;