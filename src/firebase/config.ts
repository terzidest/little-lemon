import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import type { FirebaseOptions } from 'firebase/app';

const getFirebaseConfig = (): FirebaseOptions => {
  let firebaseConfig: FirebaseOptions;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const localConfig = require('./firebase-config-local');
    firebaseConfig = localConfig.default || localConfig;
  } catch {
    const extra = Constants.expoConfig?.extra ?? {};
    firebaseConfig = {
      apiKey: process.env['FIREBASE_API_KEY'] || extra.firebaseApiKey,
      authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || extra.firebaseAuthDomain,
      projectId: process.env['FIREBASE_PROJECT_ID'] || extra.firebaseProjectId,
      storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || extra.firebaseStorageBucket,
      messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || extra.firebaseMessagingSenderId,
      appId: process.env['FIREBASE_APP_ID'] || extra.firebaseAppId,
      measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || extra.firebaseMeasurementId,
    };
  }

  return firebaseConfig;
};

const app = initializeApp(getFirebaseConfig());

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
