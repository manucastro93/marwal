import { createSignal } from 'solid-js';
import paginaService from '../../services/paginaService';
import { usuarioService } from '../../services/usuarioService';
import { showNotification } from '../Layout/Notification';

const NuevoBanner = (props: { onBannerCreated: () => void }) => {
  const [file, setFile] = createSignal<File | null>(null);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFile(target.files[0]);
      console.log('=> Archivo seleccionado:', target.files[0].name);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!file()) {
      showNotification('No se ha seleccionado ningún archivo', 'error');
      return;
    }

    const formData = new FormData();
    const user = await usuarioService.obtenerUsuarioConectado();
    formData.append('banner', file()!);
    formData.append('nombre', file()!.name);
    formData.append('posicion', '1');
    formData.append('estado', 'activo');
    formData.append('usuario_id', user.id);

    try {
      console.log('=> Enviando formulario para subir banner');
      await paginaService.crearBanner(formData);
      showNotification('Banner subido con éxito', 'success');
      props.onBannerCreated();
    } catch (error) {
      showNotification('Error al subir banner', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} class="card mb-4">
      <div class="card-body">
        <div class="form-group">
          <label for="banner">Subir Banner</label>
          <input
            type="file"
            onChange={handleFileChange}
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Subir Banner
        </button>
      </div>
    </form>
  );
};

export default NuevoBanner;