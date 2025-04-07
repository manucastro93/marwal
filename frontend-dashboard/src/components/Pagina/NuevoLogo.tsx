import { createSignal } from 'solid-js';
import paginaService from '../../services/paginaService';
import { usuarioService } from '../../services/usuarioService';

const NuevoLogo = (props: { onLogoUploaded: (url: string) => void }) => {
  const [file, setFile] = createSignal<File | null>(null);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFile(target.files[0]);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!file()) {
      console.error('=> No se ha seleccionado ningún archivo');
      return;
    }

    const formData = new FormData();
    const user = await usuarioService.obtenerUsuarioConectado();
        formData.append('logo', file()!);
        formData.append('nombre', file()!.name);
        formData.append('usuario_id', user.id);

    try {
      const response = await paginaService.subirLogo(formData);
      props.onLogoUploaded(response.url);
    } catch (error) {
      console.error('=> Error al subir logo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="card mb-4">
      <div class="card-body">
        <div class="form-group">
          <label for="logo">Subir Logo</label>
          <input
            type="file"
            onChange={handleFileChange}
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Subir Logo
        </button>
      </div>
    </form>
  );
};

export default NuevoLogo;