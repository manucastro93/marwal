import { Component, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        navigate('/login');
      }
    };
    verifyAuth();
  }, [isAuthenticated]);

  const Component = props.component;
  return isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;