import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, googleAuthAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  // Google OAuth2 methods
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: (searchParams: URLSearchParams) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string, rememberMe = false) => {
    try {
      const response = await authAPI.login({
        usernameOrEmail,
        password,
        rememberMe,
      });

      const { access_token, refresh_token } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', access_token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      // Get user profile after successful login
      try {
        const profileResponse = await authAPI.getProfile();
        setUser(profileResponse.data);
      } catch (profileError) {
        console.error('Failed to get user profile after login:', profileError);
        // Still consider login successful if we have tokens
        setUser({
          id: 'temp',
          username: usernameOrEmail,
          email: usernameOrEmail,
          firstName: '',
          lastName: ''
        });
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error_description || error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  // Google OAuth2 login - redirect to Google authorization URL
  const loginWithGoogle = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const response = await googleAuthAPI.getGoogleLoginUrl(redirectUri);
      const { authorization_url } = response.data;
      
      // Redirect to Google OAuth2 authorization URL
      window.location.href = authorization_url;
    } catch (error: any) {
      throw new Error(error.response?.data?.error_description || 'Failed to initiate Google login');
    }
  };

  // Handle Google OAuth2 callback and complete authentication
  const handleGoogleCallback = async (searchParams: URLSearchParams) => {
    try {
      const response = await googleAuthAPI.processGoogleRedirect(searchParams);
      const { access_token, refresh_token, user: userData } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', access_token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      // Set user data
      if (userData) {
        setUser({
          id: userData.user_id || userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.first_name || userData.firstName || '',
          lastName: userData.last_name || userData.lastName || ''
        });
      } else {
        // Fallback: get profile from API
        try {
          const profileResponse = await authAPI.getProfile();
          setUser(profileResponse.data);
        } catch (profileError) {
          console.error('Failed to get profile after Google login:', profileError);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete Google authentication');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    handleGoogleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
