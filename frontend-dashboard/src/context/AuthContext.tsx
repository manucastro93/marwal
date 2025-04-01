import { createContext, createSignal, useContext, JSX } from 'solid-js';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(localStorage.getItem('token') !== null);

  const login = () => {
    console.log("Logging in");
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Logging out");
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Remover el token al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuthenticated(), login, logout }}>
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