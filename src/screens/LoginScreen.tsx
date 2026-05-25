import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Screen from '../components/layout/Screen';
import AuthForm from '../components/forms/AuthForm';
import useAuth from '../hooks/useAuth';
import type { RootStackParamList } from '../types';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login, resetPassword, loading } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values, navigation);
    } catch (err) {
      Alert.alert(
        'Login Failed',
        (err as Error).message || 'Please check your credentials and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.'
      );
    } catch (err) {
      Alert.alert('Password Reset Failed', (err as Error).message);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <Screen
      title="Welcome to Little Lemon"
      subtitle="Sign in to browse our menu, manage your profile, and more."
      showBackButton={false}
    >
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        onForgotPassword={handleForgotPassword}
      />
      <View className="flex-row justify-center mt-4">
        <Text className="text-sm text-gray-600">{"Don't have an account? "}</Text>
        <TouchableOpacity onPress={navigateToRegister} testID="register-button">
          <Text className="text-sm text-primary font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default LoginScreen;
