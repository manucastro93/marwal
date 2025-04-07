import { createSignal } from 'solid-js';
import Layout from '../components/Layout/Layout';
import NuevoBanner from '../components/Pagina/NuevoBanner';
import BannerList from '../components/Pagina/BannersList';
import NuevoLogo from '../components/Pagina/NuevoLogo';
import LogoActual from '../components/Pagina/LogoActual';

const Pagina = () => {
  const [logoUrl, setLogoUrl] = createSignal<string>('');

  const handleLogoUploaded = (url: string) => {
    setLogoUrl(url);
  };

  return (
    <Layout>
      <div class="container mt-5">
        <h1 class="mb-4">Administración de Página</h1>
        <div class="row">
          <div class="col-md-6">
            <NuevoBanner onBannerCreated={() => {}} />
            <NuevoLogo onLogoUploaded={handleLogoUploaded} />
          </div>
          <div class="col-md-6">
            <BannerList />
            <LogoActual url={logoUrl()} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pagina;