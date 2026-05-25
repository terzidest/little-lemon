import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from '../ui/Checkbox';
import type { NotificationPreferences } from '../../types';

interface NotificationFormProps {
  preferences: NotificationPreferences;
  onChange: (prefs: NotificationPreferences) => void;
}

const NotificationForm = ({ preferences, onChange }: NotificationFormProps) => {
  const handleChange = (key: keyof NotificationPreferences, value: boolean) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <View className="mt-4">
      <Text className="text-xl font-bold mb-4">Email Notifications</Text>
      <Checkbox
        label="Order Statuses"
        value={preferences.orderStatuses}
        onValueChange={(value) => handleChange('orderStatuses', value)}
      />
      <Checkbox
        label="Password Changes"
        value={preferences.passwordChanges}
        onValueChange={(value) => handleChange('passwordChanges', value)}
      />
      <Checkbox
        label="Special Offers"
        value={preferences.specialOffers}
        onValueChange={(value) => handleChange('specialOffers', value)}
      />
      <Checkbox
        label="Newsletter"
        value={preferences.newsletter}
        onValueChange={(value) => handleChange('newsletter', value)}
      />
    </View>
  );
};

export default NotificationForm;
