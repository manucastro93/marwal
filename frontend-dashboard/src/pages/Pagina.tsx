import Layout from '../components/Layout';
import Banners from '../components/Banners';
import Logo from '../components/Logo';

const Pagina = () => {
  return (
    <Layout>
      <div>
        <h1>Página</h1>
        <div>
          <Banners />
          <Logo />
        </div>
      </div>
    </Layout>
  );
};

export default Pagina;