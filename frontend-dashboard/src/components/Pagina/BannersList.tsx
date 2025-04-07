import { createSignal, createEffect, For } from 'solid-js';
import paginaService from '../../services/paginaService';

const BannerList = () => {
  const [banners, setBanners] = createSignal<any[]>([]);

  const fetchBanners = async () => {
    try {
      const response = await paginaService.obtenerBannersActivos();
      setBanners(response);
    } catch (error) {
      console.error('=> Error al obtener banners activos:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await paginaService.eliminarBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('=> Error al eliminar banner:', error);
    }
  };

  createEffect(() => {
    fetchBanners();
  });

  return (
    <div class="card mb-4">
      <div class="card-body">
        <h2 class="card-title">Banners Activos</h2>
        <ul class="list-group">
          <For each={banners()}>
            {(banner) => (
              <li class="list-group-item d-flex justify-content-between align-items-center">
                  <img src={banner.url} alt={banner.nombre} class="img-thumbnail mr-2" style={{ width: '100px', height: 'auto' }} />
                  <span>{banner.nombre}</span>
                <button
                  onClick={() => handleDelete(banner.id)}
                  class="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};

export default BannerList;