import { Component, createEffect, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = createSignal(false);

  createEffect(() => {
    (async () => {
      await checkAuth();
      setAuthChecked(true);
    })();
  });

  createEffect(() => {
    if (authChecked() && !isAuthenticated) {
      navigate('/login');
    }
  });

  const Component = props.component;
  return authChecked() && isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;