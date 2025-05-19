import React from 'react';
import { Text, Pressable } from 'react-native';
import { cn } from '../../utils/style';

export const Button = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  textClassName = '',
  ...props
}) => {
  // Base button styles
  const baseButtonClasses = 'items-center justify-center rounded-md';
  
  // Variant styles
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-white border border-primary',
    danger: 'bg-red-500',
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'py-1 px-3',
    md: 'py-2 px-4',
    lg: 'py-3 px-6',
  };
  
  // Width styles
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledClasses = disabled ? 'opacity-50' : '';
  
  // Text styles
  const baseTextClasses = 'font-bold';
  
  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-black',
    outline: 'text-primary',
    danger: 'text-white',
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // Combined classes
  const buttonClasses = cn(
    baseButtonClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    disabledClasses,
    className
  );
  
  const textClasses = cn(
    baseTextClasses,
    textVariantClasses[variant],
    textSizeClasses[size],
    textClassName
  );

  return (
    <Pressable
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {({ pressed }) => (
        <Text className={cn(textClasses, pressed ? 'opacity-70' : '')}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
