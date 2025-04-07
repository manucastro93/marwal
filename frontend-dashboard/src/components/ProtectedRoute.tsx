  import { Component, createEffect } from 'solid-js';
  import { useNavigate } from '@solidjs/router';
  import { useAuth } from '../context/AuthContext';

  const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    createEffect(() => {
      if (!auth.isAuthenticated) {
        navigate('/login');
        return;
      }
    });

    const Component = props.component;
    return <Component />;
  };

  export default ProtectedRoute;