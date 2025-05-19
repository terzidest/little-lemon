import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const COLLECTIONS = {
  MENU_ITEMS: 'menu_items',
  USER_PROFILES: 'user_profiles',
  NOTIFICATION_PREFS: 'notification_preferences'
};

// Menu items operations
export const fetchMenuItems = async () => {
  try {
    const menuCollectionRef = collection(db, COLLECTIONS.MENU_ITEMS);
    const querySnapshot = await getDocs(menuCollectionRef);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: data.id || parseInt(doc.id, 10),
        name: data.name || '',
        price: data.price || 0,
        description: data.description || '',
        image: data.image || '',
        category: data.category || 'uncategorized'
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const filterMenuItems = async (categories, searchTerm) => {
  try {
    const menuCollectionRef = collection(db, COLLECTIONS.MENU_ITEMS);
    // Create query based on categories
    let menuQuery = menuCollectionRef;
    
    // If there are categories to filter by, create a query
    if (categories.length > 0) {
      menuQuery = query(
        menuCollectionRef,
        where('category', 'in', categories)
      );
    }
    
    const querySnapshot = await getDocs(menuQuery);
    
    let menuItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: data.id || parseInt(doc.id, 10),
        name: data.name || '',
        price: data.price || 0,
        description: data.description || '',
        image: data.image || '',
        category: data.category || 'uncategorized'
      });
    });
    
    // If there's a search term, filter the results client-side
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      menuItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    return menuItems;
  } catch (error) {
    console.error('Error filtering menu items:', error);
    return [];
  }
};

export const saveMenuItems = async (menuItems) => {
  try {
    // Use a batch write in a real implementation to handle multiple writes atomically
    
    for (const item of menuItems) {
      // Generate a document ID if item.id is undefined or null
      const docId = item.id ? item.id.toString() : Math.floor(Math.random() * 1000000).toString();
      
      // Make sure all menu items have an ID property before saving
      const itemToSave = {
        ...item,
        id: item.id || parseInt(docId, 10)
      };
      
      await setDoc(doc(db, COLLECTIONS.MENU_ITEMS, docId), itemToSave);
    }
    
    console.log('Menu items saved to Firestore');
  } catch (error) {
    console.error('Error saving menu items to Firestore:', error);
    throw error;
  }
};

// User profile operations
export const getUserProfile = async (userId) => {
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
        avatar: data.avatar || null
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId, profile) => {
  try {
    const userProfileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await setDoc(userProfileRef, profile, { merge: true });
    console.log('User profile saved to Firestore');
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw error;
  }
};

// Notification preferences operations
export const getNotificationPreferences = async (userId) => {
  try {
    const notificationPrefsRef = doc(db, COLLECTIONS.NOTIFICATION_PREFS, userId);
    const notificationPrefsSnap = await getDoc(notificationPrefsRef);
    
    if (notificationPrefsSnap.exists()) {
      const data = notificationPrefsSnap.data();
      return {
        orderStatuses: data.orderStatuses || false,
        passwordChanges: data.passwordChanges || false,
        specialOffers: data.specialOffers || false,
        newsletter: data.newsletter || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

export const saveNotificationPreferences = async (userId, preferences) => {
  try {
    const notificationPrefsRef = doc(db, COLLECTIONS.NOTIFICATION_PREFS, userId);
    await setDoc(notificationPrefsRef, preferences, { merge: true });
    console.log('Notification preferences saved to Firestore');
  } catch (error) {
    console.error('Error saving notification preferences to Firestore:', error);
    throw error;
  }
};

// Helper function to migrate initial menu data from API to Firestore
export const migrateMenuDataFromAPIToFirestore = async (apiUrl) => {
  try {
    console.log('Starting menu data migration from API...');
    
    // Fetch data from the API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API fetch failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API data fetched successfully');
    
    if (data && data.menu && Array.isArray(data.menu)) {
      console.log(`Found ${data.menu.length} menu items to import`);
      
      // Add validation for each menu item
      const validMenuItems = data.menu.map((item, index) => {
        // Ensure each item has the required properties
        return {
          id: item.id || index + 1,
          name: item.name || `Item ${index + 1}`,
          price: parseFloat(item.price) || 0,
          description: item.description || '',
          image: item.image || '',
          category: item.category || 'uncategorized'
        };
      });
      
      // Save the menu items to Firestore
      await saveMenuItems(validMenuItems);
      console.log('Menu data successfully migrated from API to Firestore');
    } else {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error migrating menu data from API to Firestore:', error);
    throw error;
  }
};
