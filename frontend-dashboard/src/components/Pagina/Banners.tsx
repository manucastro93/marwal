import { createSignal, onMount } from 'solid-js';
import { showNotification } from '../Layout/Notification';
import paginaService from '../../services/paginaService';
import { Banner } from '../../interfaces/Pagina';
import { BASE_URL } from '../../config';

const Banners = () => {
  const [banners, setBanners] = createSignal<Banner[]>([]);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);

  onMount(() => {
    paginaService.obtenerBanners()
      .then((response: Banner[]) => setBanners(response))
      .catch((error: any) => {
        console.error('Error al obtener los banners:', error);
        showNotification('Error al obtener los banners', 'error');
      });
  });

  const handleBannerUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    setBannerFile(file);
  };

  const handleSaveBanner = () => {
    if (bannerFile()) {
      const formData = new FormData();
      formData.append('file', bannerFile()!);

      paginaService.crearBanner(formData)
        .then((response: Banner) => {
          setBanners([...banners(), response]);
          showNotification('Banner creado con éxito', 'success');
        })
        .catch((error: any) => {
          console.error('Error al crear el banner:', error);
          showNotification('Error al crear el banner', 'error');
        });
    }
  };

  const handleDeleteBanner = (id: number) => {
    paginaService.eliminarBanner(id)
      .then(() => {
        setBanners(banners().filter(banner => banner.id !== id));
        showNotification('Banner eliminado con éxito', 'success');
      })
      .catch((error: any) => {
        console.error('Error al eliminar el banner:', error);
        showNotification('Error al eliminar el banner', 'error');
      });
  };

  return (
    <div class="banners-container">
      <h2>Banners</h2>
      <input type="file" onChange={handleBannerUpload} class="file-input" />
      <button onClick={handleSaveBanner} class="btn">Guardar Banner</button>
      <ul class="banners-list">
        {banners().map(banner => (
          <li class="banner-item">
            <img src={`${BASE_URL}${banner.url}`} alt="Banner" class="banner-image" />
            <button onClick={() => handleDeleteBanner(banner.id)} class="btn btn-delete">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Banners;