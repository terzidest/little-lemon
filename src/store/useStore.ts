import { create } from 'zustand';
import type { StoreState } from './types';
import { onAuthStateChange } from '../firebase/auth';
import createAuthSlice from './slices/authSlice';
import createProfileSlice from './slices/profileSlice';
import createNotificationsSlice from './slices/notificationsSlice';
import createMenuSlice from './slices/menuSlice';
import createAppSlice from './slices/appSlice';

export const useStore = create<StoreState>()((...a) => {
  const [set, get] = a;
  return {
  ...createAuthSlice(...a),
  ...createProfileSlice(...a),
  ...createNotificationsSlice(...a),
  ...createMenuSlice(...a),
  ...createAppSlice(...a),

  resetStore: () => {
    set({
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,
      userProfile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: null,
      },
      profileLoading: false,
      profileError: null,
      notificationPreferences: {
        orderStatuses: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
      },
      notificationsLoading: false,
      notificationsError: null,
      allMenuItems: [],
      selectedCategories: [],
      searchTerm: '',
      menuLoading: false,
      menuError: null,
      isLoading: false,
      appError: null,
    });
  },

  setupAuthListener: () => {
    const unsubscribe = onAuthStateChange((user) => {
      const store = get();
      store.setUser(user);

      if (user) {
        Promise.all([
          store.loadUserProfile(),
          store.loadNotificationPreferences(),
          store.fetchMenu(),
        ]).catch(error => {
          console.error('Error loading user data:', error);
        });
      }
    });

    return unsubscribe as () => void;
  },
  };
});

export const useAuthStore = <T>(selector: (state: StoreState) => T) => useStore(selector);
export const useProfileStore = <T>(selector: (state: StoreState) => T) => useStore(selector);
export const useNotificationsStore = <T>(selector: (state: StoreState) => T) => useStore(selector);
export const useMenuStore = <T>(selector: (state: StoreState) => T) => useStore(selector);
export const useAppStore = <T>(selector: (state: StoreState) => T) => useStore(selector);
