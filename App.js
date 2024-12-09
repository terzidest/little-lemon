import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import Splash from './screens/Splash';
import { initDB } from './database';
import { AppProvider } from './AppContext';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
 
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('@onboarding_completed');
        setIsOnboardingCompleted(onboardingStatus === 'true');
      } catch (e) {
        // Handle error
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
    initDB();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      setIsOnboardingCompleted(true);
    } catch (e) {
      // Handle error
      console.error(e);
    }
  };

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isOnboardingCompleted ? 'Home' : 'Onboarding'}>
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}  // Hide the header for Onboarding
          >
            {props => <Onboarding {...props} onComplete={handleOnboardingComplete} />}
          </Stack.Screen>
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
