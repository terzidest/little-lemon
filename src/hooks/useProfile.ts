import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../store/useStore';
import type { UserProfile, NotificationPreferences } from '../types';

const useProfile = () => {
  const {
    userProfile,
    profileLoading,
    profileError,
    notificationPreferences,
    notificationsLoading,
    notificationsError,
    updateUserProfile,
    saveUserProfile,
    loadUserProfile,
    updateNotificationPreferences,
    saveNotificationPreferences,
    loadNotificationPreferences,
  } = useStore((state) => ({
    userProfile: state.userProfile,
    profileLoading: state.profileLoading,
    profileError: state.profileError,
    notificationPreferences: state.notificationPreferences,
    notificationsLoading: state.notificationsLoading,
    notificationsError: state.notificationsError,
    updateUserProfile: state.updateUserProfile,
    saveUserProfile: state.saveUserProfile,
    loadUserProfile: state.loadUserProfile,
    updateNotificationPreferences: state.updateNotificationPreferences,
    saveNotificationPreferences: state.saveNotificationPreferences,
    loadNotificationPreferences: state.loadNotificationPreferences,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadUserProfile(), loadNotificationPreferences()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([saveUserProfile(), saveNotificationPreferences()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      setError(message);
      console.error('Error saving profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (data: Partial<UserProfile>): void => {
    updateUserProfile(data);
  };

  const updatePreferences = (preferences: Partial<NotificationPreferences>): void => {
    updateNotificationPreferences(preferences);
  };

  const pickImage = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as ImagePicker.MediaType[],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateUserProfile({ avatar: result.assets[0].uri });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to pick image';
      setError(message);
      console.error('Error picking image:', err);
    }
  };

  const removeAvatar = (): void => {
    updateUserProfile({ avatar: null });
  };

  return {
    profile: userProfile,
    preferences: notificationPreferences,
    loading: loading || profileLoading || notificationsLoading,
    error: error || profileError || notificationsError,
    loadProfile,
    saveProfile,
    updateProfile,
    updatePreferences,
    pickImage,
    removeAvatar,
  };
};

export default useProfile;
