/* @jsxImportSource solid-js */
import { createSignal, onCleanup } from "solid-js";

const banners = [
  'http://localhost:3000/uploads/imagenes/pagina/banners/1743631439151-DESKTOP_3.474e0a0c.png',
  // Agrega más URLs de banners aquí
];

const Banner = () => {
  const [currentBanner, setCurrentBanner] = createSignal(0);

  const nextBanner = () => {
    setCurrentBanner((currentBanner() + 1) % banners.length);
  };

  const interval = setInterval(nextBanner, 3000);

  onCleanup(() => clearInterval(interval));

  return (
    <div class="banner">
      <img src={banners[currentBanner()]} alt="Banner" />
    </div>
  );
};

export default Banner;