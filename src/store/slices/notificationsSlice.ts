import type { StateCreator } from 'zustand';
import type { StoreState, NotificationsState, NotificationsActions } from '../types';
import type { NotificationPreferences } from '../../types';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from '../../firebase/firestore';

export type NotificationsSlice = NotificationsState & NotificationsActions;

const createNotificationsSlice: StateCreator<StoreState, [], [], NotificationsSlice> = (
  set,
  get
) => ({
  notificationPreferences: {
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  },
  notificationsLoading: false,
  notificationsError: null,

  updateNotificationPreferences: (prefs) =>
    set({
      notificationPreferences: { ...get().notificationPreferences, ...prefs },
      notificationsError: null,
    }),

  setNotificationsLoading: (notificationsLoading) => set({ notificationsLoading }),
  setNotificationsError: (notificationsError) => set({ notificationsError }),
  resetNotificationsError: () => set({ notificationsError: null }),

  saveNotificationPreferences: async () => {
    const { user } = get();
    if (!user) {
      set({ notificationsError: 'User not authenticated' });
      return false;
    }
    try {
      set({ notificationsLoading: true });
      await saveNotificationPreferences(user.uid, get().notificationPreferences);
      set({ notificationsLoading: false, notificationsError: null });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error saving notification preferences';
      set({ notificationsLoading: false, notificationsError: message });
      return false;
    }
  },

  loadNotificationPreferences: async () => {
    const { user } = get();
    if (!user) return false;

    try {
      set({ notificationsLoading: true });
      const preferences = await getNotificationPreferences(user.uid);

      if (preferences) {
        set({ notificationPreferences: preferences, notificationsLoading: false });
      } else {
        const defaultPreferences: NotificationPreferences = {
          orderStatuses: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        };
        set({ notificationPreferences: defaultPreferences });
        await saveNotificationPreferences(user.uid, defaultPreferences);
        set({ notificationsLoading: false });
      }

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error loading notification preferences';
      set({ notificationsLoading: false, notificationsError: message });
      return false;
    }
  },
});

export default createNotificationsSlice;
