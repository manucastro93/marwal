import { Component, createEffect, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = createSignal(false);

  createEffect(() => {
    const verifyAuth = async () => {
      console.log('Verifying authentication status...');
      await checkAuth();
      setAuthChecked(true);
    };
    verifyAuth();
  }, []);

  createEffect(() => {
    console.log('Authentication checked:', authChecked());
    console.log('Is authenticated:', isAuthenticated);
    if (authChecked() && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login...');
      navigate('/login');
    }
  });

  const Component = props.component;
  return (
    <>
      {authChecked() ? (
        isAuthenticated ? (
          <Component />
        ) : (
          <div>
            <p>Not authenticated, redirecting to login...</p>
          </div>
        )
      ) : (
        <div>
          <p>Checking authentication status...</p>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;