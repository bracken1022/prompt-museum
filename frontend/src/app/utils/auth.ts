interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthData {
  user: User;
  access_token: string;
}

export const authUtils = {
  // Store authentication data
  setAuth: (authData: AuthData): void => {
    localStorage.setItem('access_token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },

  // Get stored authentication token
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Get stored user data
  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Clear authentication data
  clearAuth: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Get authorization headers for API calls
  getAuthHeaders: (): Record<string, string> => {
    const token = authUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Make authenticated API request
  fetchWithAuth: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = {
      'Content-Type': 'application/json',
      ...authUtils.getAuthHeaders(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  },
};