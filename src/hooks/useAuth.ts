import { useState } from 'react';
import { CommonActions, type NavigationProp } from '@react-navigation/native';
import type { UserCredential } from 'firebase/auth';
import { useStore } from '../store/useStore';
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  resetPassword as firebaseResetPassword,
} from '../firebase/auth';
import { handleAuthError } from '../utils/errorHandling';
import type { LoginCredentials, RegisterData, RootStackParamList } from '../types';

type AppNavigation = NavigationProp<RootStackParamList>;

const useAuth = () => {
  const {
    user,
    isAuthenticated,
    authLoading,
    authError,
    setAuthError,
    logout,
    updateUserProfile,
  } = useStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    authLoading: state.authLoading,
    authError: state.authError,
    setAuthError: state.setAuthError,
    logout: state.logout,
    updateUserProfile: state.updateUserProfile,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    credentials: LoginCredentials,
    navigation: AppNavigation
  ): Promise<UserCredential> => {
    setLoading(true);
    setError(null);
    setAuthError(null);

    try {
      const result = await loginWithEmailAndPassword(credentials);

      if (navigation && result.user) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
        );
      }

      return result;
    } catch (err) {
      const errorMessage = handleAuthError(err as { code?: string; message?: string });
      setError(errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    data: RegisterData,
    navigation: AppNavigation
  ): Promise<UserCredential> => {
    setLoading(true);
    setError(null);
    setAuthError(null);

    try {
      const userCredential = await registerWithEmailAndPassword(data);

      if (userCredential?.user) {
        await updateUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          avatar: null,
        });

        if (navigation) {
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
          );
        }
      }

      return userCredential;
    } catch (err) {
      const errorMessage = handleAuthError(err as { code?: string; message?: string });
      setError(errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutAndNavigate = async (navigation: AppNavigation): Promise<void> => {
    try {
      await logout();

      if (navigation) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
        );
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setAuthError(null);

    try {
      await firebaseResetPassword(email);
    } catch (err) {
      const errorMessage = handleAuthError(err as { code?: string; message?: string });
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
    logout: logoutAndNavigate,
  };
};

export default useAuth;
