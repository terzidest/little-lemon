import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Read Firebase config from environment variables or Expo Constants
// For using environment variables in production
const getFirebaseConfig = () => {
  // For a production app, use environment variables (process.env.VARIABLE_NAME)
  // or Expo's Constants.manifest.extra for Expo apps
  
  let firebaseConfig;
  
  // For development: Try to use local config or return placeholder
  try {
    // Try to load config from local file that isn't committed to git
    const localConfig = require('./firebase-config-local');
    firebaseConfig = localConfig.default || localConfig;
  } catch (e) {
    // If local config doesn't exist, use environment variables or Expo Constants
    firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseApiKey) || "***REMOVED***",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseAuthDomain) || "little-lemon-9bea8.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseProjectId) || "little-lemon-9bea8",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseStorageBucket) || "little-lemon-9bea8.firebasestorage.app",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseMessagingSenderId) || "680386298336",
      appId: process.env.FIREBASE_APP_ID || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseAppId) || "1:680386298336:web:7d1c8fae3c2cdda351ab85",
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.firebaseMeasurementId) || "G-NZMC9N5B9J"
    };
  }
  
  return firebaseConfig;
};

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

// Initialize Firebase Authentication with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
