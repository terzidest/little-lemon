import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import createAuthSlice from './slices/authSlice';
import createProfileSlice from './slices/profileSlice';
import createNotificationsSlice from './slices/notificationsSlice';
import createMenuSlice from './slices/menuSlice';
import createAppSlice from './slices/appSlice';

/**
 * Combined store using slices pattern
 */
export const useStore = create(
  (set, get) => ({
    // Combine all slices
    ...createAuthSlice(set, get),
    ...createProfileSlice(set, get),
    ...createNotificationsSlice(set, get),
    ...createMenuSlice(set, get),
    ...createAppSlice(set, get),
    
    // Reset entire store state
    resetStore: () => {
      set({
        // Auth state
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,
        
        // Profile state
        userProfile: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          avatar: null,
        },
        profileLoading: false,
        profileError: null,
        
        // Notification preferences
        notificationPreferences: {
          orderStatuses: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        },
        notificationsLoading: false,
        notificationsError: null,
        
        // Menu state
        menuItems: [],
        selectedCategories: [],
        searchTerm: '',
        menuLoading: false,
        menuError: null,
        
        // App state
        isLoading: false,
        appError: null,
      });
    },
    
    // Setup auth state listener
    setupAuthListener: () => {
      // Set up the Firebase auth state listener
      const unsubscribe = onAuthStateChange((user) => {
        const store = get();
        
        // First update the user state
        store.setUser(user);
        
        if (user) {
          // User is signed in, load data in the background
          Promise.all([
            store.loadUserProfile(),
            store.loadNotificationPreferences(),
            store.fetchMenu()
          ]).catch(error => {
            console.error('Error loading user data:', error);
          });
        }
      });
      
      // Return the unsubscribe function to be called when the app unmounts
      return unsubscribe;
    }
  })
);

// Create selectors for each slice to improve performance
export const useAuthStore = (selector) => useStore(selector);
export const useProfileStore = (selector) => useStore(selector);
export const useNotificationsStore = (selector) => useStore(selector);
export const useMenuStore = (selector) => useStore(selector);
export const useAppStore = (selector) => useStore(selector);

// Add missing import
import { onAuthStateChange } from '../firebase/auth';
