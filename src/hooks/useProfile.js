import { useState } from 'react';
import { useStore } from '../store/useStore';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Custom hook for profile management
 * 
 * @returns {Object} Profile state and methods
 */
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
    loadNotificationPreferences
  } = useStore(state => ({
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
    loadNotificationPreferences: state.loadNotificationPreferences
  }));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Load user profile and notification preferences
   * 
   * @returns {Promise<void>}
   */
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadUserProfile(),
        loadNotificationPreferences()
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Save user profile and notification preferences
   * 
   * @returns {Promise<void>}
   */
  const saveProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        saveUserProfile(),
        saveNotificationPreferences()
      ]);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      console.error('Error saving profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update profile data
   * 
   * @param {Object} data - Profile data to update
   */
  const updateProfile = (data) => {
    updateUserProfile(data);
  };
  
  /**
   * Update notification preferences
   * 
   * @param {Object} preferences - Notification preferences to update
   */
  const updatePreferences = (preferences) => {
    updateNotificationPreferences(preferences);
  };
  
  /**
   * Pick image from device library
   * 
   * @returns {Promise<void>}
   */
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateUserProfile({ avatar: result.assets[0].uri });
      }
    } catch (err) {
      setError(err.message || 'Failed to pick image');
      console.error('Error picking image:', err);
    }
  };
  
  /**
   * Remove profile avatar
   */
  const removeAvatar = () => {
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
    removeAvatar
  };
};

export default useProfile;
