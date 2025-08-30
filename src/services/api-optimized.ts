import tokenManager, { apiCall, apiCallJson } from './TokenManager';

/**
 * Optimized API Service for SmartDrive
 * 
 * Features:
 * 1. Automatic JWT token management
 * 2. Automatic token refresh on 401 errors
 * 3. Seamless retry of failed requests
 * 4. Clean error handling
 * 5. TypeScript support
 */

const baseURL = 'http://localhost:8080'; // API Gateway port

// Helper function to create consistent API responses
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  success: boolean;
}

async function makeRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${baseURL}${endpoint}`;
  
  const requestOptions: RequestInit = {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  const response = await apiCall(url, requestOptions);
  
  if (!response) {
    throw new Error('Request failed - no response received');
  }

  let responseData: T;
  
  try {
    responseData = await response.json();
  } catch (error) {
    // Handle empty responses
    responseData = {} as T;
  }

  return {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    success: response.ok,
  };
}

// Auth API endpoints (updated for new flow)
export const authAPI = {
  // Login with optimized JWT response
  login: (credentials: { usernameOrEmail: string; password: string }) =>
    makeRequest<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      user: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
      };
    }>('/api/v1/auth/login', 'POST', credentials),

  // Refresh token (handled automatically by TokenManager)
  refresh: (refreshToken: string) =>
    makeRequest<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    }>('/api/oauth2/token/refresh', 'POST', { refresh_token: refreshToken }),

  // Register new user
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => makeRequest('/api/v1/users/register', 'POST', userData),

  // Verify email
  verifyEmail: (token: string) =>
    makeRequest('/api/v1/users/verify-email', 'POST', { token }),

  // Get current user profile
  getProfile: () => makeRequest('/api/v1/users/profile'),

  // Logout (clears tokens)
  logout: async () => {
    await tokenManager.logout();
    return { success: true };
  },
};

// User API endpoints
export const userAPI = {
  // Get user profile
  getProfile: () => makeRequest('/api/v1/users/profile'),
  
  // Update user profile
  updateProfile: (profileData: any) =>
    makeRequest('/api/v1/users/profile', 'PUT', profileData),
  
  // Change password
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => makeRequest('/api/v1/users/change-password', 'POST', passwordData),

  // Get user files
  getFiles: () => makeRequest('/api/v1/users/files'),

  // User management (admin)
  getAllUsers: () => makeRequest('/api/v1/admin/users'),
  getUserById: (id: string) => makeRequest(`/api/v1/admin/users/${id}`),
  updateUser: (id: string, userData: any) =>
    makeRequest(`/api/v1/admin/users/${id}`, 'PUT', userData),
  deleteUser: (id: string) =>
    makeRequest(`/api/v1/admin/users/${id}`, 'DELETE'),
};

// File API endpoints
export const fileAPI = {
  // Upload file
  uploadFile: async (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiCall(`${baseURL}/api/v1/files/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    if (!response) {
      throw new Error('File upload failed');
    }

    return {
      data: await response.json(),
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
    };
  },

  // Download file
  downloadFile: (fileId: string) =>
    makeRequest(`/api/v1/files/${fileId}/download`),

  // Get file metadata
  getFileMetadata: (fileId: string) =>
    makeRequest(`/api/v1/files/${fileId}/metadata`),

  // Delete file
  deleteFile: (fileId: string) =>
    makeRequest(`/api/v1/files/${fileId}`, 'DELETE'),

  // Get user files
  getUserFiles: () => makeRequest('/api/v1/files'),

  // Share file
  shareFile: (fileId: string, shareData: any) =>
    makeRequest(`/api/v1/files/${fileId}/share`, 'POST', shareData),
};

// Search API endpoints
export const searchAPI = {
  // Search files
  searchFiles: (query: string, filters?: any) =>
    makeRequest('/api/v1/search/files', 'POST', { query, filters }),

  // Advanced search
  advancedSearch: (searchParams: any) =>
    makeRequest('/api/v1/search/advanced', 'POST', searchParams),

  // Get search suggestions
  getSuggestions: (query: string) =>
    makeRequest(`/api/v1/search/suggestions?q=${encodeURIComponent(query)}`),
};

// AI API endpoints
export const aiAPI = {
  // Get file insights
  getFileInsights: (fileId: string) =>
    makeRequest(`/api/v1/ai/insights/${fileId}`),

  // Generate file summary
  generateSummary: (fileId: string) =>
    makeRequest(`/api/v1/ai/summary/${fileId}`, 'POST'),

  // Ask AI about file
  askAboutFile: (fileId: string, question: string) =>
    makeRequest(`/api/v1/ai/ask/${fileId}`, 'POST', { question }),

  // Get AI recommendations
  getRecommendations: () =>
    makeRequest('/api/v1/ai/recommendations'),
};

// OAuth2 API endpoints (legacy support)
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
  }) => makeRequest('/auth/oauth2/authorize', 'GET'),

  // Exchange code for token
  getToken: (data: {
    grantType: string;
    code: string;
    redirectUri: string;
    clientId: string;
    codeVerifier?: string;
  }) => makeRequest('/auth/oauth2/token', 'POST', data),

  // Get user info
  getUserInfo: () => makeRequest('/auth/oauth2/userinfo'),

  // Introspect token
  introspectToken: (token: string) =>
    makeRequest('/auth/oauth2/introspect', 'POST', { token }),

  // Revoke token
  revokeToken: (token: string) =>
    makeRequest('/auth/oauth2/revoke', 'POST', { token }),
};

// Main API object (backward compatibility)
const api = {
  get: <T>(url: string) => makeRequest<T>(url, 'GET'),
  post: <T>(url: string, data?: any) => makeRequest<T>(url, 'POST', data),
  put: <T>(url: string, data?: any) => makeRequest<T>(url, 'PUT', data),
  delete: <T>(url: string) => makeRequest<T>(url, 'DELETE'),
};

export default api;

// Export token manager for direct access if needed
export { tokenManager };

// Helper functions for common operations
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => tokenManager.isAuthenticated(),
  
  // Get current user from token
  getCurrentUser: () => tokenManager.getCurrentUser(),
  
  // Set tokens after login
  setTokens: (accessToken: string, refreshToken: string) =>
    tokenManager.setTokens(accessToken, refreshToken),
  
  // Clear tokens and logout
  logout: () => tokenManager.logout(),
  
  // Manual token refresh
  refreshToken: () => tokenManager.refreshAccessToken(),
};
