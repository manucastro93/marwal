import { Component, createSignal, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = createSignal(false);

  const verifyAuth = async () => {
    console.log('Verifying authentication status...');
    await checkAuth();
    setAuthChecked(true);
  };

  verifyAuth();

  onCleanup(() => {
    setAuthChecked(false);
  });

  return (
    <>
      {authChecked() ? (
        isAuthenticated ? (
          <props.component />
        ) : (
          <div>
            <p>Not authenticated, redirecting to login...</p>
            {navigate('/login')}
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