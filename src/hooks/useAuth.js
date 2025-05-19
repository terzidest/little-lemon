import { useState } from 'react';
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
   * Handle authentication state to prevent UI flicker
   */
  const startAuthenticating = () => {
    if (window.setIsAuthenticating) {
      window.setIsAuthenticating(true);
    }
  };
  
  /**
   * Reset authentication state if there's an error
   */
  const resetAuthenticating = () => {
    if (window.setIsAuthenticating) {
      window.setIsAuthenticating(false);
    }
  };
  
  /**
   * Login with email and password
   * 
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} User object
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    
    try {
      startAuthenticating();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const result = await loginWithEmailAndPassword(credentials);
      return result;
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setAuthError(errorMessage);
      resetAuthenticating();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register new user with email and password
   * 
   * @param {Object} data - Registration data
   * @returns {Promise<Object>} User object
   */
  const register = async (data) => {
    setLoading(true);
    setError(null);
    setAuthError(null);
    
    try {
      startAuthenticating();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const userCredential = await registerWithEmailAndPassword(data);
      
      // Initialize user profile
      if (userCredential?.user) {
        updateUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          avatar: null
        });
      }
      
      return userCredential;
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      setAuthError(errorMessage);
      resetAuthenticating();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
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
    logout
  };
};

export default useAuth;
