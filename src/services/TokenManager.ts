/**
 * Token Manager for SmartDrive Frontend
 * 
 * Implements optimized token management with automatic refresh:
 * 1. Manages JWT access tokens and refresh tokens
 * 2. Automatic token refresh on 401 responses
 * 3. Seamless retry of failed requests after refresh
 * 4. Secure token storage in localStorage
 * 5. Automatic logout on refresh failure
 */

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  /**
   * Load tokens from localStorage on initialization
   */
  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  /**
   * Make authenticated request with automatic token refresh
   * This is the main method for all API calls
   */
  async makeAuthenticatedRequest(url: string, options: RequestOptions = {}): Promise<Response | null> {
    // Add access token to request headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // If token expired (401), try to refresh and retry
    if (response.status === 401 && this.refreshToken) {
      console.log('🔄 Access token expired, attempting refresh...');
      
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed && this.accessToken) {
        console.log('✅ Token refreshed successfully, retrying request');
        // Retry request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        console.log('❌ Token refresh failed, redirecting to login');
        this.redirectToLogin();
        return null;
      }
    }

    return response;
  }

  /**
   * Refresh access token using refresh token
   * Implements Step 3 of your auth flow
   */
  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return this.refreshPromise || Promise.resolve(false);
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async _performRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      console.log('❌ No refresh token available');
      return false;
    }

    try {
      console.log('🔄 Calling refresh token endpoint...');
      
      const response = await fetch('/api/oauth2/token/refresh', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          refresh_token: this.refreshToken 
        })
      });

      if (response.ok) {
        const tokens: TokenResponse = await response.json();
        this.setTokens(tokens.access_token, tokens.refresh_token);
        
        console.log('✅ Token refresh successful');
        return true;
      } else {
        console.log('❌ Token refresh failed:', response.status, response.statusText);
        const errorData = await response.text();
        console.log('❌ Refresh error details:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Token refresh network error:', error);
      return false;
    }
  }

  /**
   * Set new tokens and store them securely
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    console.log('💾 Tokens stored successfully');
  }

  /**
   * Clear all tokens and redirect to login
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    console.log('🗑️ Tokens cleared');
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.refreshToken);
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Decode JWT token to get user info (client-side only, for UI purposes)
   * Note: Never trust client-side JWT decoding for security decisions
   */
  getCurrentUser(): any {
    if (!this.accessToken) {
      return null;
    }

    try {
      // Decode JWT payload (for UI display only)
      const parts = this.accessToken.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return {
        userId: payload.sub,
        username: payload.username,
        email: payload.email,
        roles: payload.roles || [],
        exp: payload.exp
      };
    } catch (error) {
      console.error('❌ Error decoding JWT:', error);
      return null;
    }
  }

  /**
   * Check if token is close to expiry (refresh proactively)
   */
  isTokenNearExpiry(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = user.exp - currentTime;
    
    // Refresh if less than 5 minutes remaining
    return timeUntilExpiry < 300;
  }

  /**
   * Proactively refresh token if near expiry
   */
  async refreshIfNeeded(): Promise<void> {
    if (this.isTokenNearExpiry() && !this.isRefreshing) {
      console.log('⏰ Token near expiry, refreshing proactively...');
      await this.refreshAccessToken();
    }
  }

  /**
   * Redirect to login page
   */
  redirectToLogin(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      // await this.makeAuthenticatedRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      this.redirectToLogin();
    }
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

// Set up periodic token refresh check
setInterval(() => {
  tokenManager.refreshIfNeeded();
}, 60000); // Check every minute

export default tokenManager;

// Helper function for easy API calls
export async function apiCall(url: string, options: RequestOptions = {}): Promise<Response | null> {
  return tokenManager.makeAuthenticatedRequest(url, options);
}

// Helper function for JSON API calls
export async function apiCallJson<T>(url: string, options: RequestOptions = {}): Promise<T | null> {
  const response = await tokenManager.makeAuthenticatedRequest(url, options);
  
  if (!response) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
