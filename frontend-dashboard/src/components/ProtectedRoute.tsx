import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: Component<{ component: Component }> = (props) => {
  const auth = useAuth();
  const navigate = useNavigate();

  console.log("ProtectedRoute: isAuthenticated =", auth.isAuthenticated);

  if (!auth.isAuthenticated) {
    console.log("Redirecting to /login");
    navigate('/login');
    return null;
  }

  const Component = props.component;
  return <Component />;
};

export default ProtectedRoute;