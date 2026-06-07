import apiClient from './apiClient';

interface LoginResponse {
  token: string;
  tokenType: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  expiresIn: number;
}

interface VerifyResponse {
  valid: boolean;
}

const authService = {
  /**
   * User login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/verify', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Get stored user
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },
};

export default authService;
