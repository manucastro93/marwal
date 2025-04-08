import { Component, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    console.log("create efect: ", isAuthenticated)
    if (!isAuthenticated) {
      navigate('/login');
    }
  });
  console.log("fuera: ", isAuthenticated)
  const Component = props.component;
  return isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;