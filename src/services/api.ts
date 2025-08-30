import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // API Gateway port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // User registration
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => api.post('/api/v1/users/register', userData),

  // User login using custom auth endpoint
  login: (credentials: {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    return api.post('/api/v1/auth/login', {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    });
  },

  // User logout
  logout: () => api.post('/auth/api/v1/users/logout'),

  // Get user profile
  getProfile: () => api.get('/api/v1/users/profile'),

  // Update user profile
  updateProfile: (profileData: any) => api.put('/api/v1/users/profile', profileData),

  // Change password
  changePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/api/v1/users/change-password', passwords),

  // Forgot password
  forgotPassword: (email: string) => api.post('/api/v1/users/forgot-password', { email }),

  // Reset password
  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => api.post('/api/v1/users/reset-password', data),

  // Verify email
  verifyEmail: (token: string) => api.get(`/api/v1/users/verify-email?token=${token}`),

  // Delete account
  deleteAccount: () => api.delete('/api/v1/users/profile'),
};

// OAuth2 API endpoints
export const oauth2API = {
  // Get authorization URL
  getAuthUrl: (params: {
    responseType: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    state?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
  }) => api.get('/auth/oauth2/authorize', { params }),

  // Exchange code for token
  getToken: (data: {
    grantType: string;
    code: string;
    redirectUri: string;
    clientId: string;
    codeVerifier?: string;
  }) => api.post('/auth/oauth2/token', data),

  // Get user info
  getUserInfo: () => api.get('/auth/oauth2/userinfo'),

  // Introspect token
  introspectToken: (token: string) => api.post('/auth/oauth2/introspect', { token }),

  // Revoke token
  revokeToken: (token: string) => api.post('/auth/oauth2/revoke', { token }),

  // Register OAuth2 client
  registerClient: (clientData: any) => api.post('/auth/oauth2/register', clientData),
};

// Google OAuth2 Social Login API endpoints
export const googleAuthAPI = {
  // Get Google OAuth2 authorization URL
  getGoogleLoginUrl: (redirectUri?: string) => {
    const params = redirectUri ? `?redirectUri=${encodeURIComponent(redirectUri)}` : '';
    return api.get(`/api/v1/auth/social/google/login-url${params}`);
  },

  // Handle Google OAuth2 callback (POST)
  handleGoogleCallback: (data: {
    code: string;
    state?: string;
  }) => api.post('/api/v1/auth/social/google/callback', data),

  // Handle Google OAuth2 callback via URL params (for browser redirects)
  processGoogleRedirect: (searchParams: URLSearchParams) => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    if (error) {
      throw new Error(`Google OAuth2 error: ${error}`);
    }
    
    if (!code) {
      throw new Error('No authorization code received from Google');
    }
    
    return googleAuthAPI.handleGoogleCallback({ code, state: state || undefined });
  },
};

export default api;
