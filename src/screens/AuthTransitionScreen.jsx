import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const AuthTransitionScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#495E57" />
    </View>
  );
};

export default AuthTransitionScreen;