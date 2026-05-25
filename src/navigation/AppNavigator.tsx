import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useStore } from '../store/useStore';
import { auth } from '../firebase/config';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isAuthenticated, setUser } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
  }));

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user: User | null) => {
          clearTimeout(timeoutId);
          setUser(user);
          setIsAuthLoading(false);
        },
        (error: Error) => {
          setAuthError(error.message);
          setIsAuthLoading(false);
        }
      );

      timeoutId = setTimeout(() => {
        setIsAuthLoading(false);
      }, 3000);
    } catch (error) {
      setAuthError((error as Error).message);
      setIsAuthLoading(false);
    }

    return () => {
      unsubscribe?.();
      clearTimeout(timeoutId);
    };
  }, [setUser]);

  if (isAuthLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'none' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'none' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ animation: 'none' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: 'none' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
