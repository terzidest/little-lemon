import { getUserProfile, saveUserProfile } from '../../firebase/firestore';

/**
 * User profile store slice
 */
const createProfileSlice = (set, get) => ({
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
  
  // Update user profile
  updateUserProfile: (profile) => {
    set({ 
      userProfile: { ...get().userProfile, ...profile },
      profileError: null
    });
  },
  
  // Set profile loading state
  setProfileLoading: (profileLoading) => set({ profileLoading }),
  
  // Set profile error
  setProfileError: (profileError) => set({ profileError }),
  
  // Reset profile error
  resetProfileError: () => set({ profileError: null }),
  
  // Save user profile to Firestore
  saveUserProfile: async () => {
    const { user } = get();
    
    if (!user) {
      set({ profileError: 'User not authenticated' });
      return false;
    }
    
    try {
      set({ profileLoading: true });
      
      // Save to Firestore
      await saveUserProfile(user.uid, get().userProfile);
      
      set({ 
        profileLoading: false,
        profileError: null
      });
      
      return true;
    } catch (error) {
      set({ 
        profileLoading: false,
        profileError: error.message || 'Error saving user profile'
      });
      return false;
    }
  },
  
  // Load user profile from Firestore
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) {
      return false;
    }
    
    try {
      set({ profileLoading: true });
      
      // Load from Firestore
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        set({ 
          userProfile: profile,
          profileLoading: false
        });
      } else {
        // If no profile exists yet in Firestore, initialize with basic info from Firebase Auth
        const newProfile = {
          firstName: user.displayName ? user.displayName.split(' ')[0] : '',
          lastName: user.displayName ? user.displayName.split(' ')[1] : '',
          email: user.email || '',
          phone: '',
          avatar: null,
        };
        
        set({ userProfile: newProfile });
        
        // Save this initial profile to Firestore
        await saveUserProfile(user.uid, newProfile);
        set({ profileLoading: false });
      }
      
      return true;
    } catch (error) {
      set({ 
        profileLoading: false,
        profileError: error.message || 'Error loading user profile'
      });
      return false;
    }
  }
});

export default createProfileSlice;
