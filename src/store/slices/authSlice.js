import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, logout as firebaseLogout } from '../../firebase/auth';

/**
 * Authentication store slice
 */
const createAuthSlice = (set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  
  // Set user and authentication state
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    authError: null
  }),
  
  // Set auth loading state
  setAuthLoading: (authLoading) => set({ authLoading }),
  
  // Set auth error
  setAuthError: (authError) => set({ authError }),
  
  // Reset auth error
  resetAuthError: () => set({ authError: null }),
  
  // Logout user
  logout: async () => {
    try {
      set({ authLoading: true });
      
      // Logout from Firebase
      await firebaseLogout();
      
      // Clear auth state
      set({
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null
      });
      
      return true;
    } catch (error) {
      set({ 
        authLoading: false,
        authError: error.message || 'Error during logout'
      });
      return false;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      set({ authLoading: true });
      
      const user = await getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user,
        authLoading: false 
      });
      
      return user;
    } catch (error) {
      set({ 
        authLoading: false,
        authError: error.message || 'Error getting current user'
      });
      return null;
    }
  }
});

export default createAuthSlice;