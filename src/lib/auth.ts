export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Validates user credentials
 * @param email - User email
 * @param password - User password
 * @returns AuthResponse with user data or error
 */
export async function validateCredentials(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    if (!email || password.length < 6) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Check against stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }

    return {
      success: false,
      error: 'Invalid credentials',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Checks if user is authenticated
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('user');
  return !!user;
}

/**
 * Gets current user from storage
 * @returns User object or null
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Logs out user by clearing storage
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}