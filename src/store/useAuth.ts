import { create } from 'zustand';
import { User } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User | null) => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({
      user,
      isAuthenticated: !!user,
    });
  },
}));