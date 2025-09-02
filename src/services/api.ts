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
  // Public/Utility endpoints
  getJwks: () => api.get('/auth/.well-known/jwks.json'),
  getOpenIdConfiguration: () => api.get('/auth/.well-known/openid_configuration'),
  getOAuth2Consent: (params: { client_id: string; scope: string; state: string }) => 
    api.get('/auth/oauth2/consent', { params }),

  // Custom auth flow
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

  refresh: (refreshToken: string) => 
    api.post('/api/v1/auth/refresh', { refreshToken }),

  // OAuth2 token refresh (alternate)
  refreshOAuth2Token: (refreshToken: string) => 
    api.post('/auth/oauth2/token/refresh', { refreshToken }),

  // User logout
  logout: () => api.post('/auth/api/v1/users/logout'),
};

// User API endpoints
export const userAPI = {
  // Public endpoints
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => api.post('/api/v1/users/register', userData),

  verifyEmail: (token: string) => api.get(`/api/v1/users/verify-email?token=${token}`),

  // Internal endpoints (called by auth service; gateway headers required)
  verifyCredentials: (credentials: { username: string; password: string }) => 
    api.post('/api/v1/users/verify-credentials', credentials),

  getUserTokenClaims: (username: string) => 
    api.get(`/api/v1/users/${username}/token-claims`),

  getUserTokenClaimsById: (userId: string) => 
    api.get(`/api/v1/users/id/${userId}/token-claims`),

  getUserProfile: (username: string) => 
    api.get(`/api/v1/users/${username}/profile`),

  // Business endpoints (requires auth)
  getProfile: () => api.get('/api/v1/users/profile'),

  updateProfile: (profileData: any) => api.put('/api/v1/users/profile', profileData),

  updateUserProfile: (userId: string, profileData: any) => 
    api.put(`/api/v1/users/${userId}/profile`, profileData),

  changePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/api/v1/users/change-password', passwords),

  deleteUser: (userId: string) => api.delete(`/api/v1/users/${userId}`),

  getUserTokenClaimsByEmail: (email: string) => 
    api.get(`/api/v1/users/email/${email}/token-claims`),

  googleRegister: (googleData: any) => api.post('/api/v1/users/google-register', googleData),

  // Admin endpoints (requires auth, admin)
  getAdminUsers: () => api.get('/api/v1/admin/users'),

  getAdminUsersStatistics: () => api.get('/api/v1/admin/users/statistics'),

  toggleUserStatus: (username: string) => 
    api.put(`/api/v1/admin/users/${username}/toggle`),

  updateUserRoles: (username: string, roles: string[]) => 
    api.put(`/api/v1/admin/users/${username}/roles`, { roles }),

  deleteAdminUser: (username: string) => 
    api.delete(`/api/v1/admin/users/${username}`),

  getAdminUser: (username: string) => 
    api.get(`/api/v1/admin/users/${username}`),
};

// Security test endpoints
export const securityTestAPI = {
  public: () => api.get('/api/v1/security-test/public'),
  protected: () => api.get('/api/v1/security-test/protected'),
  admin: () => api.get('/api/v1/security-test/admin'),
  userData: (userId: string) => api.get(`/api/v1/security-test/user/${userId}/data`),
  whoami: () => api.get('/api/v1/security-test/whoami'),
  checkRole: (role: string) => api.get(`/api/v1/security-test/roles/check?role=${role}`),
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
