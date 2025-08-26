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

  // User login using OAuth2 password grant
  login: (credentials: {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
    clientId?: string;
  }) => {
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.usernameOrEmail);
    formData.append('password', credentials.password);
    formData.append('client_id', credentials.clientId || 'smartdrive-web');
    
    return api.post('/auth/oauth2/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  // User logout
  logout: () => api.post('/auth/api/v1/users/logout'),

  // Get user profile
  getProfile: () => api.get('/auth/api/v1/users/profile'),

  // Update user profile
  updateProfile: (profileData: any) => api.put('/auth/api/v1/users/profile', profileData),

  // Change password
  changePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/auth/api/v1/users/change-password', passwords),

  // Forgot password
  forgotPassword: (email: string) => api.post('/auth/api/v1/users/forgot-password', { email }),

  // Reset password
  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => api.post('/auth/api/v1/users/reset-password', data),

  // Verify email
  verifyEmail: (token: string) => api.get(`/api/v1/users/verify-email?token=${token}`),

  // Delete account
  deleteAccount: () => api.delete('/auth/api/v1/users/account'),
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

export default api;
