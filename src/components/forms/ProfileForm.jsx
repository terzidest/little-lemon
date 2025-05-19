import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getInitials } from '../../utils/helpers';
import useForm from '../../hooks/useForm';
import { validateProfile } from '../../utils/validation';

/**
 * Profile information form component
 */
const ProfileForm = ({
  profile,
  onSave,
  onPickImage,
  onRemoveImage,
  loading
}) => {
  const {
    values,
    errors,
    handleChange,
    validateForm,
    isValid
  } = useForm({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || ''
  }, validateProfile);
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(values);
    }
  };
  
  return (
    <View>
      {/* Avatar Section */}
      <View className="mb-6">
        <Text className="mb-2 text-base">Avatar</Text>
        <View className="flex-row items-center">
          {profile.avatar ? (
            <Image 
              source={{ uri: profile.avatar }} 
              className="w-20 h-20 rounded-full mr-4"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-lightGray mr-4 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {getInitials(values.firstName, values.lastName)}
              </Text>
            </View>
          )}
          
          <View>
            <Button 
              title="Change" 
              onPress={onPickImage}
              variant="primary"
              size="sm"
              className="mb-2 w-32"
            />
            <Button 
              title="Remove" 
              onPress={onRemoveImage}
              variant="outline"
              size="sm"
              className="w-32"
            />
          </View>
        </View>
      </View>
      
      {/* Form Inputs */}
      <Input
        label="First Name"
        value={values.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        error={errors.firstName}
        autoCapitalize="words"
        className="bg-white mb-3"
      />
      
      <Input
        label="Last Name"
        value={values.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
        autoCapitalize="words"
        className="bg-white mb-3"
      />
      
      <Input
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-white mb-3"
      />
      
      <Input
        label="Phone Number"
        value={values.phone}
        onChangeText={(text) => handleChange('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
        className="bg-white mb-3"
      />
      
      <Button
        title="Save Changes"
        onPress={handleSave}
        variant="primary"
        className="mt-4"
        loading={loading}
        disabled={!isValid || loading}
      />
    </View>
  );
};

export default ProfileForm;
