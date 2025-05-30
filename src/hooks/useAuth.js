import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import { 
  loginWithEmailAndPassword, 
  registerWithEmailAndPassword,
  resetPassword as firebaseResetPassword,
} from '../firebase/auth';
import { handleAuthError } from '../utils/errorHandling';

/**
 * Custom hook for authentication operations
 * 
 * @returns {Object} Auth state and methods
 */
const useAuth = () => {
  const { 
    user,
    isAuthenticated,
    authLoading,
    authError,
    setUser,
    setAuthLoading,
    setAuthError,
    logout,
    updateUserProfile 
  } = useStore(state => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    authLoading: state.authLoading,
    authError: state.authError,
    setUser: state.setUser,
    setAuthLoading: state.setAuthLoading,
    setAuthError: state.setAuthError,
    logout: state.logout,
    updateUserProfile: state.updateUserProfile
  }));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Login with email and password
   * 
   * @param {Object} credentials - Login credentials
   * @param {Object} navigation - Navigation object
   * @returns {Promise<Object>} User object
   */
  const login = async (credentials, navigation) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    
    try {
      const result = await loginWithEmailAndPassword(credentials);
      
      // Navigate to home immediately after successful login
      if (navigation && result.user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      }
      
      return result;
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register new user with email and password
   * 
   * @param {Object} data - Registration data
   * @param {Object} navigation - Navigation object
   * @returns {Promise<Object>} User object
   */
  const register = async (data, navigation) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    
    try {
      const userCredential = await registerWithEmailAndPassword(data);
      
      // Initialize user profile
      if (userCredential?.user) {
        await updateUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          avatar: null
        });
        
        // Navigate to home immediately after successful registration
        if (navigation) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }
      }
      
      return userCredential;
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Logout and navigate to login
   * 
   * @param {Object} navigation - Navigation object
   */
  const logoutAndNavigate = async (navigation) => {
    try {
      await logout();
      
      // Navigate to login after logout
      if (navigation) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  /**
   * Reset user password
   * 
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    
    try {
      await firebaseResetPassword(email);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    isAuthenticated,
    loading: loading || authLoading,
    error: error || authError,
    login,
    register,
    resetPassword,
    logout: logoutAndNavigate
  };
};

export default useAuth;