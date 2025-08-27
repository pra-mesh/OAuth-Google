import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

/**
 * Authentication service that handles all auth-related API calls
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      data
    );
    return response.data;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>(API_CONFIG.ENDPOINTS.ME);
    return response.data;
  }

  /**
   * Logout user (clear tokens)
   */
  logout(): void {
    apiService.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  /**
   * Get Google OAuth login URL
   */
  getGoogleLoginUrl(): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GOOGLE_LOGIN}`;
  }

  /**
   * Set authentication tokens
   */
  setTokens(authResponse: AuthResponse): void {
    apiService.setTokens(authResponse);
  }
}

// Export singleton instance
export const authService = new AuthService();