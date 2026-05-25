import React from 'react';
import { Text, Pressable, type PressableProps } from 'react-native';
import { cn } from '../../utils/style';

interface ButtonOwnProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  loading?: boolean;
}

type ButtonProps = ButtonOwnProps & Omit<PressableProps, 'children'>;

export const Button = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
  ...props
}: ButtonProps) => {
  const variantClasses: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-white border border-primary',
    danger: 'bg-red-500',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'py-1 px-3',
    md: 'py-2 px-4',
    lg: 'py-3 px-6',
  };

  const textVariantClasses: Record<string, string> = {
    primary: 'text-white',
    secondary: 'text-black',
    outline: 'text-primary',
    danger: 'text-white',
  };

  const textSizeClasses: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const buttonClasses = cn(
    'items-center justify-center rounded-md',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50' : '',
    className
  );

  const textClasses = cn(
    'font-bold',
    textVariantClasses[variant],
    textSizeClasses[size],
    textClassName
  );

  return (
    <Pressable className={buttonClasses} disabled={disabled || loading} {...props}>
      {({ pressed }) => (
        <Text className={cn(textClasses, pressed ? 'opacity-70' : '')}>{title}</Text>
      )}
    </Pressable>
  );
};
