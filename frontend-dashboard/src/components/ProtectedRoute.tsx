import { Component, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  
  createEffect(() => {
    const verifyAuth = async () => {
      console.log('Verifying authentication status...');
      await checkAuth();
    };
    verifyAuth();
  }, []);

  createEffect(() => {
    console.log('Authentication checked:', isAuthenticated());
    if (!isAuthenticated()) {
      console.log('Not authenticated, redirecting to login...');
      navigate('/login');
    }
  });

  const Component = props.component;
  return isAuthenticated() ? <Component /> : <p>Checking authentication status...</p>;
};

export default ProtectedRoute;