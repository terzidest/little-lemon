import React from 'react';
import { View, Text, Switch, type SwitchProps } from 'react-native';
import { cn } from '../../utils/style';

interface CheckboxProps extends SwitchProps {
  label: string;
  className?: string;
  labelClassName?: string;
}

export const Checkbox = ({
  label,
  value,
  onValueChange,
  className = '',
  labelClassName = '',
  ...props
}: CheckboxProps) => {
  return (
    <View className={cn('flex-row items-center mb-3', className)}>
      <Text className={cn('flex-1 text-base', labelClassName)}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e1e4e9', true: '#495E57' }}
        thumbColor={value ? '#F4CE14' : '#f4f3f4'}
        ios_backgroundColor="#e1e4e9"
        {...props}
      />
    </View>
  );
};
