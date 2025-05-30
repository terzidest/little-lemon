import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/layout/Screen';
import AuthForm from '../components/forms/AuthForm';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, resetPassword, loading, error } = useAuth();
  
  const handleLogin = async (values) => {
    try {
      await login(values, navigation);
      // Navigation is handled in the login function
    } catch (err) {
      // Error is already handled in useAuth hook
      // Just show alert with user-friendly message
      Alert.alert(
        'Login Failed', 
        err.message || 'Please check your credentials and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };
  
  const handleForgotPassword = async (email) => {
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
      Alert.alert('Password Reset Failed', err.message);
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
        <Text className="text-sm text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={navigateToRegister} testID="register-button">
          <Text className="text-sm text-primary font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default LoginScreen;