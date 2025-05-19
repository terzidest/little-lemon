import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import useForm from '../../hooks/useForm';
import { validateLogin, validateRegistration } from '../../utils/validation';

/**
 * Shared component for login and registration forms
 */
const AuthForm = ({
  type = 'login', // 'login' or 'register'
  onSubmit,
  loading = false,
  initialValues = {},
  showForgotPassword = true,
  onForgotPassword
}) => {
  const validator = type === 'login' ? validateLogin : validateRegistration;
  
  const defaultValues = type === 'login' 
    ? { email: '', password: '', ...initialValues }
    : { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', ...initialValues };
  
  const {
    values,
    errors,
    handleChange,
    validateForm,
    isValid
  } = useForm(defaultValues, validator);
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(values);
    }
  };
  
  return (
    <View className="w-full">
      {type === 'register' && (
        <View className="flex-row justify-between">
          <View className="w-[48%]">
            <Input
              label="First Name"
              value={values.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              error={errors.firstName}
              autoCapitalize="words"
              testID="first-name-input"
            />
          </View>
          
          <View className="w-[48%]">
            <Input
              label="Last Name"
              value={values.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              error={errors.lastName}
              autoCapitalize="words"
              testID="last-name-input"
            />
          </View>
        </View>
      )}
      
      <Input
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        className={type === 'register' ? 'mt-4' : ''}
        testID="email-input"
      />
      
      <Input
        label="Password"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        className="mt-3"
        testID="password-input"
      />
      
      {type === 'register' && (
        <Input
          label="Confirm Password"
          value={values.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          className="mt-3"
          testID="confirm-password-input"
        />
      )}
      
      {type === 'login' && showForgotPassword && (
        <TouchableOpacity
          className="self-end mt-2 mb-5"
          onPress={() => onForgotPassword(values.email)}
          testID="forgot-password-button"
        >
          <Text className="text-sm text-primary font-medium">Forgot password?</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        className={`bg-primary h-12 rounded-lg justify-center items-center ${type === 'login' ? 'mb-5' : 'mb-5 mt-5'}`}
        onPress={handleSubmit}
        disabled={loading || !isValid}
        style={{ opacity: (loading || !isValid) ? 0.7 : 1 }}
        testID={`${type}-button`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white text-base font-medium">
            {type === 'login' ? 'Login' : 'Register'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AuthForm;
