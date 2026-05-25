import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold text-primary mb-8">Little Lemon</Text>
      <ActivityIndicator size="large" color="#495E57" />
    </View>
  );
};

export default SplashScreen;
