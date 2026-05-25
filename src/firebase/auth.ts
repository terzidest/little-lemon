import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type UserCredential,
  type Unsubscribe,
  type NextOrObserver,
} from 'firebase/auth';
import { auth } from './config';
import type { RegisterData, LoginCredentials } from '../types';

export const registerWithEmailAndPassword = async (data: RegisterData): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
    }

    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: NextOrObserver<User>): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
