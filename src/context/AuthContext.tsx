import { createContext, ReactNode, useEffect, useState } from "react";

// Props for the Provider component
interface AuthProviderProps {
  children: ReactNode;
}

interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

// Context type
interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    // In a real app, you might remove a token from localStorage here
  };

  // Example of an initial check (e.g., checking local storage or an API call)
  useEffect(() => {
    fetchUser();
  }, []);

  // Function to fetch user data
  const fetchUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/user/me?user_id=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const res = await response.json();
      console.log({ res });
      if (response.ok) {
        setUser(res.data);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // The value provided to consuming components
  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    fetchUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
