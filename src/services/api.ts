import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Auth service port
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
    firstName: string;
    lastName: string;
    acceptTerms: boolean;
    marketingConsent?: boolean;
  }) => api.post('/users/register', userData),

  // User login
  login: (credentials: {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
    clientId?: string;
  }) => api.post('/users/login', credentials),

  // User logout
  logout: () => api.post('/users/logout'),

  // Get user profile
  getProfile: () => api.get('/users/profile'),

  // Update user profile
  updateProfile: (profileData: any) => api.put('/users/profile', profileData),

  // Change password
  changePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/users/change-password', passwords),

  // Forgot password
  forgotPassword: (email: string) => api.post('/users/forgot-password', { email }),

  // Reset password
  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => api.post('/users/reset-password', data),

  // Verify email
  verifyEmail: (token: string) => api.get(`/users/verify-email?token=${token}`),

  // Delete account
  deleteAccount: () => api.delete('/users/account'),
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
  }) => api.get('/oauth2/authorize', { params }),

  // Exchange code for token
  getToken: (data: {
    grantType: string;
    code: string;
    redirectUri: string;
    clientId: string;
    codeVerifier?: string;
  }) => api.post('/oauth2/token', data),

  // Get user info
  getUserInfo: () => api.get('/oauth2/userinfo'),

  // Introspect token
  introspectToken: (token: string) => api.post('/oauth2/introspect', { token }),

  // Revoke token
  revokeToken: (token: string) => api.post('/oauth2/revoke', { token }),

  // Register OAuth2 client
  registerClient: (clientData: any) => api.post('/oauth2/register', clientData),
};

export default api;
