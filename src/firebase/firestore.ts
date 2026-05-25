import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type { MenuItem, UserProfile, NotificationPreferences } from '../types';

const COLLECTIONS = {
  MENU_ITEMS: 'menu_items',
  USER_PROFILES: 'user_profiles',
  NOTIFICATION_PREFS: 'notification_preferences',
} as const;

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuCollectionRef = collection(db, COLLECTIONS.MENU_ITEMS);
    const querySnapshot = await getDocs(menuCollectionRef);

    const menuItems: MenuItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      menuItems.push({
        id: data.id || parseInt(docSnap.id, 10),
        name: data.name || '',
        price: data.price || 0,
        description: data.description || '',
        image: data.image || '',
        category: data.category || 'uncategorized',
      });
    });

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const filterMenuItems = async (
  categories: string[],
  searchTerm: string
): Promise<MenuItem[]> => {
  try {
    const menuCollectionRef = collection(db, COLLECTIONS.MENU_ITEMS);

    const menuQuery =
      categories.length > 0
        ? query(menuCollectionRef, where('category', 'in', categories))
        : menuCollectionRef;

    const querySnapshot = await getDocs(menuQuery);

    let menuItems: MenuItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      menuItems.push({
        id: data.id || parseInt(docSnap.id, 10),
        name: data.name || '',
        price: data.price || 0,
        description: data.description || '',
        image: data.image || '',
        category: data.category || 'uncategorized',
      });
    });

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      menuItems = menuItems.filter(
        item =>
          item.name.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower)
      );
    }

    return menuItems;
  } catch (error) {
    console.error('Error filtering menu items:', error);
    return [];
  }
};

export const saveMenuItems = async (menuItems: MenuItem[]): Promise<void> => {
  try {
    for (const item of menuItems) {
      const docId = item.id ? item.id.toString() : Math.floor(Math.random() * 1_000_000).toString();
      const itemToSave: MenuItem = {
        ...item,
        id: item.id || parseInt(docId, 10),
      };
      await setDoc(doc(db, COLLECTIONS.MENU_ITEMS, docId), itemToSave);
    }
    console.log('Menu items saved to Firestore');
  } catch (error) {
    console.error('Error saving menu items to Firestore:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userProfileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    const userProfileSnap = await getDoc(userProfileRef);

    if (userProfileSnap.exists()) {
      const data = userProfileSnap.data();
      return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || null,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    const userProfileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await setDoc(userProfileRef, profile, { merge: true });
    console.log('User profile saved to Firestore');
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw error;
  }
};

export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences | null> => {
  try {
    const prefsRef = doc(db, COLLECTIONS.NOTIFICATION_PREFS, userId);
    const prefsSnap = await getDoc(prefsRef);

    if (prefsSnap.exists()) {
      const data = prefsSnap.data();
      return {
        orderStatuses: data.orderStatuses || false,
        passwordChanges: data.passwordChanges || false,
        specialOffers: data.specialOffers || false,
        newsletter: data.newsletter || false,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

export const saveNotificationPreferences = async (
  userId: string,
  preferences: NotificationPreferences
): Promise<void> => {
  try {
    const prefsRef = doc(db, COLLECTIONS.NOTIFICATION_PREFS, userId);
    await setDoc(prefsRef, preferences, { merge: true });
    console.log('Notification preferences saved to Firestore');
  } catch (error) {
    console.error('Error saving notification preferences to Firestore:', error);
    throw error;
  }
};

export const migrateMenuDataFromAPIToFirestore = async (apiUrl: string): Promise<void> => {
  try {
    console.log('Starting menu data migration from API...');
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API fetch failed with status: ${response.status}`);
    }

    const data = await response.json() as { menu?: Array<Record<string, unknown>> };
    console.log('API data fetched successfully');

    if (data && data.menu && Array.isArray(data.menu)) {
      console.log(`Found ${data.menu.length} menu items to import`);
      const validMenuItems: MenuItem[] = data.menu.map((item, index) => ({
        id: (item.id as number | string) || index + 1,
        name: (item.name as string) || `Item ${index + 1}`,
        price: parseFloat((item.price as string) ?? '0') || 0,
        description: (item.description as string) || '',
        image: (item.image as string) || '',
        category: (item.category as string) || 'uncategorized',
      }));

      await saveMenuItems(validMenuItems);
      console.log('Menu data successfully migrated from API to Firestore');
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error migrating menu data from API to Firestore:', error);
    throw error;
  }
};
