import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import {User} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: {id: string; email: string; password: string}) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the provider component
export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadUser();
  }, []);

  const login = ({id, name, email}: any) => {
    setUser({id: id, name: name, email: email});
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const storeUser = async (newUser: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser: (newUser: User) => {
          setUser(newUser);
          storeUser(newUser);
        },
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
