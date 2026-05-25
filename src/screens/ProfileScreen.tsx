import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
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
    updateProfile,
    updatePreferences,
    pickImage,
    removeAvatar,
  } = useProfile();

  const { logout } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    setHasChanges(true);
  }, [profile, preferences]);

  const handleSaveProfile = async (formData: Partial<UserProfile>) => {
    try {
      updateProfile(formData);
      await saveProfile();
      setHasChanges(false);
      Alert.alert('Success', 'Your changes have been saved');
    } catch {
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const handleNotificationChange = (newPreferences: NotificationPreferences) => {
    updatePreferences(newPreferences);
  };

  const handleDiscardChanges = async () => {
    await loadProfile();
    setHasChanges(false);
  };

  const handleLogout = async () => {
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
        className="mt-6 mb-4"
        fullWidth
      />
      {hasChanges && (
        <View className="flex-row justify-between mb-8">
          <Button
            title="Discard Changes"
            onPress={handleDiscardChanges}
            variant="outline"
            className="flex-1 mr-2"
          />
          <Button
            title="Save Changes"
            onPress={() => saveProfile()}
            variant="primary"
            className="flex-1 ml-2"
            loading={loading}
          />
        </View>
      )}
    </Screen>
  );
};

export default ProfileScreen;
