import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState } from 'react';
import { authAPI, googleAuthAPI, userAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
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
  updateProfile: (profileData: ProfileData) => Promise<void>;
  // Google OAuth2 methods
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: (searchParams: URLSearchParams) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Utility function to decode JWT token and extract user info
const decodeJWTToken = (token: string): User | null => {
  try {
    // JWT tokens have 3 parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('⚠️ Invalid JWT token format');
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload);
    
    console.log('🔍 JWT token payload:', tokenData);
    
    // Extract user information from token claims
    const user: User = {
      id: tokenData.sub || 'unknown', // 'sub' is the standard JWT subject claim
      username: tokenData.username || tokenData.preferred_username || 'user',
      email: tokenData.email || 'user@example.com',
      firstName: tokenData.given_name || tokenData.firstName || '',
      lastName: tokenData.family_name || tokenData.lastName || ''
    };
    
    return user;
  } catch (error) {
    console.error('❌ Failed to decode JWT token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  
  // Debug logging when authentication state changes
  useEffect(() => {
    console.log('🔄 AuthContext: Authentication state changed:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AuthContext: Checking authentication on app start');
      const token = localStorage.getItem('accessToken');
      console.log('🔑 AuthContext: Found token in localStorage:', !!token);
      
      if (token) {
        try {
          console.log('📡 AuthContext: Fetching user profile...');
          const response = await userAPI.getProfile();
          console.log('✅ AuthContext: User profile fetched:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('❌ AuthContext: Failed to get user profile:', error);
          console.error('❌ AuthContext: Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: (error as { response?: { data?: unknown } })?.response?.data,
            status: (error as { response?: { status?: number } })?.response?.status
          });
          
          // Don't remove tokens immediately, try to decode JWT token for user info
          console.log('🔄 AuthContext: Trying to decode JWT token for user info...');
          
          try {
            // Decode JWT token to get user information
            const userFromToken = decodeJWTToken(token);
            if (userFromToken) {
              console.log('✅ AuthContext: Extracted user from JWT token:', userFromToken);
              setUser(userFromToken);
            } else {
              // Fallback to basic user if token decode fails
              const basicUser = {
                id: 'temp_user',
                username: 'user',
                email: 'user@example.com',
                firstName: '',
                lastName: ''
              };
              console.log('👤 AuthContext: Setting basic user as fallback:', basicUser);
              setUser(basicUser);
            }
          } catch (decodeError) {
            console.error('❌ AuthContext: Failed to decode JWT token:', decodeError);
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } else {
        console.log('❌ AuthContext: No token found in localStorage');
      }
      
      console.log('🏁 AuthContext: Setting isLoading to false');
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
        const profileResponse = await userAPI.getProfile();
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { error_description?: string; message?: string } } }).response;
        throw new Error(response?.data?.error_description || response?.data?.message || 'Login failed');
      }
      throw new Error(errorMessage);
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
      const response = await userAPI.register(userData);
      return response.data;
    } catch (error: unknown) {
      let errorMessage = 'Registration failed';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
        errorMessage = response?.data?.message || response?.data?.error || 'Registration failed';
      }
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

  const updateProfile = async (profileData: ProfileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      setUser(response.data);
    } catch (error: unknown) {
      let errorMessage = 'Profile update failed';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || 'Profile update failed';
      }
      throw new Error(errorMessage);
    }
  };

  // Google OAuth2 login - open popup window for Google authorization
  const loginWithGoogle = async () => {
    try {
      const redirectUri = `http://localhost:8080/api/v1/auth/social/google/callback`;
      console.log('🔗 Getting Google OAuth2 URL with redirect:', redirectUri);
      
      const response = await googleAuthAPI.getGoogleLoginUrl(redirectUri);
      const { authorization_url } = response.data;
      console.log('✅ Got Google OAuth2 URL:', authorization_url);
      
      // Try to open popup window
      const popup = window.open(
        authorization_url,
        'google-oauth2',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no'
      );
      
      if (!popup) {
        console.error('❌ Popup blocked by browser');
        // Fallback: redirect in same window
        console.log('🔄 Falling back to same window redirect');
        window.location.href = authorization_url;
        return;
      }
      
      console.log('✅ Popup opened successfully');
      
      // Listen for popup window messages
      const handleMessage = (event: MessageEvent) => {
        console.log('📨 Received message from popup:', event.data);
        if (event.origin !== window.location.origin) {
          console.log('❌ Ignoring message from different origin:', event.origin);
          return;
        }
        
        if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
          console.log('✅ Google login successful, reloading page');
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          // Refresh the page or update state
          window.location.reload();
        } else if (event.data.type === 'GOOGLE_LOGIN_ERROR') {
          console.error('❌ Google login error:', event.data.error);
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          // You could show an error message here
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Also listen for popup window close
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          console.log('🔒 Popup window closed');
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          // Check if we have tokens in localStorage (set by callback)
          const token = localStorage.getItem('accessToken');
          if (token) {
            console.log('✅ Found access token, reloading page');
            // Refresh the page or update state
            window.location.reload();
          } else {
            console.log('❌ No access token found after popup closed');
          }
        }
      }, 1000);
      
    } catch (error: unknown) {
      let errorMessage = 'Failed to initiate Google login';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { error_description?: string } } }).response;
        errorMessage = response?.data?.error_description || 'Failed to initiate Google login';
      }
      throw new Error(errorMessage);
    }
  };

  // Handle Google OAuth2 callback and complete authentication
  const handleGoogleCallback = async (searchParams: URLSearchParams) => {
    try {
      // Check if we have tokens in URL parameters (from backend redirect)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const email = searchParams.get('email');
      const username = searchParams.get('username');
      
      if (accessToken && email) {
        // Store tokens from URL parameters
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Set user data directly
        const userData = {
          id: 'google_user',
          username: username || email,
          email: email,
          firstName: '',
          lastName: ''
        };
        
        setUser(userData);
        console.log('✅ Google authentication completed successfully');
        console.log('👤 User data set:', userData);
        console.log('🔐 isAuthenticated will be:', !!userData);
        return;
      }
      
      // Fallback: try API call if no tokens in URL
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
          const profileResponse = await userAPI.getProfile();
          setUser(profileResponse.data);
        } catch (profileError) {
          console.error('Failed to get profile after Google login:', profileError);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete Google authentication';
      console.error('❌ Google authentication error:', errorMessage);
      throw new Error(errorMessage);
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

export { AuthContext };
