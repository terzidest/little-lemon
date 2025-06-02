import { useEffect, useState } from 'react';
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

export const AppNavigator = () => {
  const { 
    isAuthenticated,
    setUser,
  } = useStore();
  
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize app and set up auth listener
  useEffect(() => {
    let unsubscribe;
    let timeoutId;
    
    try {
      // Set up auth state listener
      unsubscribe = onAuthStateChanged(auth, (user) => {
        // Clear timeout since auth responded
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Update user state
        setUser(user);
        
        // Mark auth as loaded
        setIsAuthLoading(false);
      }, (error) => {
        setAuthError(error.message);
        setIsAuthLoading(false);
      });
      
      // Set a timeout in case Firebase doesn't respond
      timeoutId = setTimeout(() => {
        setIsAuthLoading(false);
      }, 3000); // 3 second timeout
      
    } catch (error) {
      setAuthError(error.message);
      setIsAuthLoading(false);
    }
    
    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [setUser]);

  // Show splash screen while checking auth
  if (isAuthLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          animationDuration: 200
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                animationEnabled: false
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                animationEnabled: false
              }}
            />
          </>
        ) : (
          // Non-authenticated screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                animation: 'slide_from_right'
              }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                animationEnabled: false
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                animationEnabled: false
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};