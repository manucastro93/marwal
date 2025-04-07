import { createSignal, onMount } from 'solid-js';
import { showNotification } from './Layout/Notification';
import apiService from '../services/apiService';
import type { Logo } from '../interfaces/Pagina';
import { BASE_URL } from '../config';

const Logo = () => {
  const [logo, setLogo] = createSignal<Logo | null>(null);
  const [logoFile, setLogoFile] = createSignal<File | null>(null);

  onMount(() => {
    apiService.getLogo()
      .then((response: Logo) => setLogo(response))
      .catch((error: any) => {
        console.error('Error al obtener el logo:', error);
        showNotification('Error al obtener el logo', 'error');
      });
  });

  const handleLogoUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    setLogoFile(file);
  };

  const handleSaveLogo = () => {
    if (logoFile()) {
      const formData = new FormData();
      formData.append('file', logoFile()!);

      apiService.createOrUpdateLogo(formData)
        .then((response: Logo) => {
          setLogo(response);
          showNotification('Logo actualizado con éxito', 'success');
        })
        .catch((error: any) => {
          console.error('Error al actualizar el logo:', error);
          showNotification('Error al actualizar el logo', 'error');
        });
    }
  };

  return (
    <div class="logo-container">
      <h2>Logo</h2>
      <input type="file" onChange={handleLogoUpload} class="file-input" />
      <button onClick={handleSaveLogo} class="btn">Guardar Logo</button>
      {logo() && <img src={`${BASE_URL}${logo()?.url}`} alt="Logo" class="logo-image" />}
    </div>
  );
};

export default Logo;