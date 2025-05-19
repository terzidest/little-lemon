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
      await register(values);
      // Navigation will be handled by auth state listener
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
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
