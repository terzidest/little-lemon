import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import store and auth
import { useStore } from '../store/useStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const Stack = createNativeStackNavigator();

// Define screen groups for cleaner navigation structure
const AuthStack = () => (
  <>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ animationEnabled: false }}
    />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </>
);

const MainStack = () => (
  <>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ animationEnabled: false }}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </>
);

export const AppNavigator = () => {
  const { 
    isLoading, 
    isAuthenticated,
    setIsLoading,
    setUser
  } = useStore();
  
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Create a function to be used by auth screens
  const handleAuthStateChange = (isAuthenticating) => {
    setIsAuthenticating(isAuthenticating);
  };

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
        setIsAppReady(true);
      }
    };
    
    initialize();
  }, []);
  
  // Set up auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isAuthenticating && user) {
        // During active authentication, we delay setting the user
        // to prevent navigation flickers
        setTimeout(() => {
          setUser(user);
          setTimeout(() => setIsAuthenticating(false), 300);
        }, 500);
      } else {
        // For normal auth state changes or logout
        setUser(user);
      }
    });
    
    return unsubscribe;
  }, [isAuthenticating]);
  
  // Make auth state handler available to other components
  useEffect(() => {
    window.setIsAuthenticating = handleAuthStateChange;
    
    return () => {
      delete window.setIsAuthenticating;
    };
  }, []);

  // Show splash screen while loading
  if (isLoading || !isAppReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated || isAuthenticating ? (
          MainStack()
        ) : (
          AuthStack()
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
