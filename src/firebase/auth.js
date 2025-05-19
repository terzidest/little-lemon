import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

/**
 * Register a new user with email and password
 */
export const registerWithEmailAndPassword = async (data) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    // Update the user's display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login with email and password
 */
export const loginWithEmailAndPassword = async (credentials) => {
  try {
    return await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Set up an auth state listener
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
