import { createContext, ReactNode, useEffect, useState } from "react";
import { IUser } from "../api/types";
// import { IGetUserResponse, IUser } from "../api/types";
// import fetchApi from "../api/fetchApi";
// import { config } from "../config/config";

// Props for the Provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Context type
interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (details: Partial<IUser>) => void;
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
    try {
      setIsLoading(true);
      // const response = await fetchApi<IGetUserResponse>({
      //   url: `${config.apiUrl}/user/me`,
      //   method: 'GET',
      // });
      const response = await window.ipcRenderer.getMyProfile();
      console.log({ response });
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (details: Partial<IUser>) => {
    const updatedUser = { ...user, ...details } as IUser;
    setUser(updatedUser);
  }

  // The value provided to consuming components
  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    fetchUser,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
