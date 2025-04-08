import { Component, createEffect, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component, roles?: string[] }> = (props) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = createSignal(false);
  const [loading, setLoading] = createSignal(true);

  createEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setAuthChecked(true);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  createEffect(() => {
    if (authChecked() && !isAuthenticated()) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated]);

  const Component = props.component;
  return (
    <>
      {loading() ? (
        <div>
          <img src="https://marwal.s3.sa-east-1.amazonaws.com/imagenes_pagina/cargando.gif" alt="Loading..." />
          <p>Checking authentication status...</p>
        </div>
      ) : (
        authChecked() && isAuthenticated() ? (
          <Component />
        ) : (
          <div>
            <p>Not authenticated, redirecting to login...</p>
          </div>
        )
      )}
    </>
  );
};

export default ProtectedRoute;