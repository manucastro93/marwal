import { createContext, createSignal, useContext, JSX } from 'solid-js';
import authService from '../services/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(localStorage.getItem('token') !== null);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Remover el token al cerrar sesión
  };

  const checkAuth = async () => {
    try {
      await authService.getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  // Check authentication status on mount
  checkAuth();

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated(), login, logout, checkAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};