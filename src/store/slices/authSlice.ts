import type { StateCreator } from 'zustand';
import type { StoreState, AuthState, AuthActions } from '../types';
import { getCurrentUser, logout as firebaseLogout } from '../../firebase/auth';

export type AuthSlice = AuthState & AuthActions;

const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      authError: null,
    }),

  setAuthLoading: (authLoading) => set({ authLoading }),
  setAuthError: (authError) => set({ authError }),
  resetAuthError: () => set({ authError: null }),

  logout: async () => {
    try {
      set({ authLoading: true });
      await firebaseLogout();
      set({ user: null, isAuthenticated: false, authLoading: false, authError: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error during logout';
      set({ authLoading: false, authError: message });
      return false;
    }
  },

  getCurrentUser: async () => {
    try {
      set({ authLoading: true });
      const user = getCurrentUser();
      set({ user, isAuthenticated: !!user, authLoading: false });
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error getting current user';
      set({ authLoading: false, authError: message });
      return null;
    }
  },
});

export default createAuthSlice;
