import type { User } from 'firebase/auth';
import type { MenuItem, UserProfile, NotificationPreferences } from '../types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  resetAuthError: () => void;
  logout: () => Promise<boolean>;
  getCurrentUser: () => Promise<User | null>;
}

export interface MenuState {
  menuItems: MenuItem[];
  allMenuItems: MenuItem[];
  selectedCategories: string[];
  searchTerm: string;
  menuLoading: boolean;
  menuError: string | null;
}

export interface MenuActions {
  setMenuLoading: (loading: boolean) => void;
  setMenuError: (error: string | null) => void;
  resetMenuError: () => void;
  fetchMenu: () => Promise<boolean>;
  setMenuItems: (items: MenuItem[]) => void;
  toggleCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

export interface ProfileState {
  userProfile: UserProfile;
  profileLoading: boolean;
  profileError: string | null;
}

export interface ProfileActions {
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setProfileLoading: (loading: boolean) => void;
  setProfileError: (error: string | null) => void;
  resetProfileError: () => void;
  saveUserProfile: () => Promise<boolean>;
  loadUserProfile: () => Promise<boolean>;
}

export interface NotificationsState {
  notificationPreferences: NotificationPreferences;
  notificationsLoading: boolean;
  notificationsError: string | null;
}

export interface NotificationsActions {
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  setNotificationsLoading: (loading: boolean) => void;
  setNotificationsError: (error: string | null) => void;
  resetNotificationsError: () => void;
  saveNotificationPreferences: () => Promise<boolean>;
  loadNotificationPreferences: () => Promise<boolean>;
}

export interface AppState {
  isLoading: boolean;
  appError: string | null;
}

export interface AppActions {
  setIsLoading: (loading: boolean) => void;
  setAppError: (error: string | null) => void;
  resetAppError: () => void;
}

export interface StoreRootActions {
  resetStore: () => void;
  setupAuthListener: () => () => void;
}

export type StoreState =
  AuthState & AuthActions &
  MenuState & MenuActions &
  ProfileState & ProfileActions &
  NotificationsState & NotificationsActions &
  AppState & AppActions &
  StoreRootActions;
