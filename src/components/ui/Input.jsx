import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { cn } from '../../utils/style';

export const Input = ({
  label,
  error,
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  className = '',
  ...props
}) => {
  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && (
        <Text className={cn('mb-1 text-sm font-medium text-gray-700', labelClassName)}>
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'border border-gray-300 rounded-md p-2 text-base',
          error ? 'border-red-500' : '',
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && (
        <Text className={cn('mt-1 text-xs text-red-500', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
};
