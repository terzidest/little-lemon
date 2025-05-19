import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import Header from '../Header';

/**
 * Base Screen component that provides consistent layout and styling
 */
const Screen = ({ 
  children, 
  title, 
  subtitle,
  showBackButton = false, 
  showHeader = true,
  headerProps = {},
  padding = true,
  scroll = true,
  keyboardAvoidingView = true,
  ...props 
}) => {
  const Content = () => (
    <View className={`flex-1 ${padding ? 'px-5 py-2' : ''}`}>
      {title && <Text className="text-2xl font-bold text-primary mb-2">{title}</Text>}
      {subtitle && <Text className="text-base text-gray-600 mb-6">{subtitle}</Text>}
      {children}
    </View>
  );

  const screenContent = (
    <>
      {showHeader && (
        <Header 
          showBackButton={showBackButton}
          {...headerProps}
        />
      )}
      
      {scroll ? (
        <ScrollView 
          className="flex-1" 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Content />
        </ScrollView>
      ) : (
        <Content />
      )}
    </>
  );
  
  if (keyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}
        {...props}
      >
        {screenContent}
      </KeyboardAvoidingView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-white" {...props}>
      {screenContent}
    </SafeAreaView>
  );
};

export default Screen;
