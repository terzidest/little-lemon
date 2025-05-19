import { 
  getNotificationPreferences, 
  saveNotificationPreferences 
} from '../../firebase/firestore';

/**
 * Notification preferences store slice
 */
const createNotificationsSlice = (set, get) => ({
  // Notification preferences state
  notificationPreferences: {
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  },
  notificationsLoading: false,
  notificationsError: null,
  
  // Update notification preferences
  updateNotificationPreferences: (preferences) => {
    set({ 
      notificationPreferences: { 
        ...get().notificationPreferences, 
        ...preferences 
      },
      notificationsError: null
    });
  },
  
  // Set notifications loading state
  setNotificationsLoading: (notificationsLoading) => set({ notificationsLoading }),
  
  // Set notifications error
  setNotificationsError: (notificationsError) => set({ notificationsError }),
  
  // Reset notifications error
  resetNotificationsError: () => set({ notificationsError: null }),
  
  // Save notification preferences to Firestore
  saveNotificationPreferences: async () => {
    const { user } = get();
    
    if (!user) {
      set({ notificationsError: 'User not authenticated' });
      return false;
    }
    
    try {
      set({ notificationsLoading: true });
      
      // Save to Firestore
      await saveNotificationPreferences(user.uid, get().notificationPreferences);
      
      set({ 
        notificationsLoading: false,
        notificationsError: null
      });
      
      return true;
    } catch (error) {
      set({ 
        notificationsLoading: false,
        notificationsError: error.message || 'Error saving notification preferences'
      });
      return false;
    }
  },
  
  // Load notification preferences from Firestore
  loadNotificationPreferences: async () => {
    const { user } = get();
    
    if (!user) {
      return false;
    }
    
    try {
      set({ notificationsLoading: true });
      
      // Load from Firestore
      const preferences = await getNotificationPreferences(user.uid);
      
      if (preferences) {
        set({ 
          notificationPreferences: preferences,
          notificationsLoading: false
        });
      } else {
        // If no preferences exist yet, initialize with defaults and save to Firestore
        const defaultPreferences = {
          orderStatuses: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        };
        
        set({ notificationPreferences: defaultPreferences });
        
        // Save default preferences to Firestore
        await saveNotificationPreferences(user.uid, defaultPreferences);
        set({ notificationsLoading: false });
      }
      
      return true;
    } catch (error) {
      set({ 
        notificationsLoading: false,
        notificationsError: error.message || 'Error loading notification preferences'
      });
      return false;
    }
  }
});

export default createNotificationsSlice;
