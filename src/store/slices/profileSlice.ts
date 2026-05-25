import type { StateCreator } from 'zustand';
import type { StoreState, ProfileState, ProfileActions } from '../types';
import type { UserProfile } from '../../types';
import { getUserProfile, saveUserProfile } from '../../firebase/firestore';

export type ProfileSlice = ProfileState & ProfileActions;

const createProfileSlice: StateCreator<StoreState, [], [], ProfileSlice> = (set, get) => ({
  userProfile: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: null,
  },
  profileLoading: false,
  profileError: null,

  updateUserProfile: (profile) =>
    set({
      userProfile: { ...get().userProfile, ...profile },
      profileError: null,
    }),

  setProfileLoading: (profileLoading) => set({ profileLoading }),
  setProfileError: (profileError) => set({ profileError }),
  resetProfileError: () => set({ profileError: null }),

  saveUserProfile: async () => {
    const { user } = get();
    if (!user) {
      set({ profileError: 'User not authenticated' });
      return false;
    }
    try {
      set({ profileLoading: true });
      await saveUserProfile(user.uid, get().userProfile);
      set({ profileLoading: false, profileError: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving user profile';
      set({ profileLoading: false, profileError: message });
      return false;
    }
  },

  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return false;

    try {
      set({ profileLoading: true });
      const profile = await getUserProfile(user.uid);

      if (profile) {
        set({ userProfile: profile, profileLoading: false });
      } else {
        const nameParts = (user.displayName || '').split(' ');
        const newProfile: UserProfile = {
          firstName: nameParts[0] || '',
          lastName: nameParts[1] || '',
          email: user.email || '',
          phone: '',
          avatar: null,
        };
        set({ userProfile: newProfile });
        await saveUserProfile(user.uid, newProfile);
        set({ profileLoading: false });
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading user profile';
      set({ profileLoading: false, profileError: message });
      return false;
    }
  },
});

export default createProfileSlice;
