import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/layout/Screen';
import AuthForm from '../components/forms/AuthForm';
import useAuth from '../hooks/useAuth';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, loading } = useAuth();
  
  const handleRegister = async (values) => {
    try {
      await register(values, navigation);
      // Navigation is handled in the register function
    } catch (err) {
      // Error is already handled in useAuth hook
      // Just show alert with user-friendly message
      Alert.alert(
        'Registration Failed', 
        err.message || 'Please check your information and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Screen
      title="Create an account"
      subtitle="Join Little Lemon to enjoy our delicious Mediterranean cuisine."
      showBackButton={true}
    >
      <AuthForm 
        type="register"
        onSubmit={handleRegister}
        loading={loading}
      />
      
      <View className="flex-row justify-center mt-4">
        <Text className="text-sm text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={navigateToLogin} testID="login-button">
          <Text className="text-sm text-primary font-medium">Login</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default RegisterScreen;