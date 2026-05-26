import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Screen from '../components/layout/Screen';
import ProfileForm from '../components/forms/ProfileForm';
import NotificationForm from '../components/forms/NotificationForm';
import { Button } from '../components/ui/Button';
import useProfile from '../hooks/useProfile';
import useAuth from '../hooks/useAuth';
import type { RootStackParamList, UserProfile, NotificationPreferences } from '../types';

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    profile,
    preferences,
    loading,
    loadProfile,
    saveProfile,
    savePreferences,
    updateProfile,
    updatePreferences,
    pickImage,
    removeAvatar,
  } = useProfile();

  const { logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (formData: Partial<UserProfile>) => {
    try {
      updateProfile(formData);
      await saveProfile();
      Alert.alert('Success', 'Your changes have been saved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile changes';
      Alert.alert('Error', message);
    }
  };

  const handleNotificationChange = async (newPreferences: NotificationPreferences) => {
    updatePreferences(newPreferences);
    try {
      await savePreferences();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save notification preferences';
      Alert.alert('Error', message);
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout(navigation);
          } catch {
            // handled silently
          }
        },
      },
    ]);
  };

  return (
    <Screen
      title="Profile"
      showBackButton
      headerProps={{
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: profile.avatar,
        showAvatar: true,
      }}
    >
      <ProfileForm
        profile={profile}
        onSave={handleSaveProfile}
        onPickImage={pickImage}
        onRemoveImage={removeAvatar}
        loading={loading}
      />
      <NotificationForm preferences={preferences} onChange={handleNotificationChange} />
      <Button
        title="Logout"
        onPress={handleLogout}
        variant="secondary"
        className="mt-6 mb-8"
        fullWidth
      />
    </Screen>
  );
};

export default ProfileScreen;
