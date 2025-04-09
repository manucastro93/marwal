import { createContext, useContext, createSignal, Component, JSX, onMount } from 'solid-js';
import { authService } from '../services/authService';
import { usuarioService } from '../services/usuarioService';

interface AuthContextProps {
  isAuthenticated: () => boolean;
  userRole: () => string | null;
  login: (usuario: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
  const [userRole, setUserRole] = createSignal<string | null>(null);

  const login = async (usuario: string, contrasena: string) => {
    try {
      const response = await authService.login(usuario, contrasena);
      localStorage.setItem('token', response.token);
      localStorage.setItem('isAuthenticated', 'true');
      const user = await usuarioService.obtenerUsuarioConectado();
      localStorage.setItem('userRole', user.rol);
      setUserRole(user.rol);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('AuthContext: login failed', error);
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      throw error;
    }
  };
  

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('AuthContext: logout failed', error);
    }
  };

  const checkAuth = async () => {
    try {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(isAuth);
      setUserRole(role);
    } catch (error) {
      setIsAuthenticated(false);
      console.error('checkAuth: failed', error);
    }
  };

  // Check authentication status on mount
  onMount(() => {
    checkAuth();
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, checkAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};