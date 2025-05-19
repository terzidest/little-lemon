import { useState } from 'react';
import { useStore } from '../store/useStore';

/**
 * Custom hook for menu operations
 * 
 * @returns {Object} Menu state and methods
 */
const useMenu = () => {
  const {
    menuItems,
    allMenuItems,
    menuLoading,
    menuError,
    selectedCategories,
    searchTerm,
    fetchMenu,
    toggleCategory,
    setSearchTerm,
    resetFilters
  } = useStore(state => ({
    menuItems: state.menuItems,
    allMenuItems: state.allMenuItems,
    menuLoading: state.menuLoading,
    menuError: state.menuError,
    selectedCategories: state.selectedCategories,
    searchTerm: state.searchTerm,
    fetchMenu: state.fetchMenu,
    toggleCategory: state.toggleCategory,
    setSearchTerm: state.setSearchTerm,
    resetFilters: state.resetFilters
  }));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Fetch menu with current filters
   * 
   * @returns {Promise<void>}
   */
  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchMenu();
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get list of unique categories from menu items
   * 
   * @returns {Array<string>} Array of category names
   */
  const getCategories = () => {
    // Use allMenuItems if available to get all possible categories
    const items = allMenuItems.length > 0 ? allMenuItems : menuItems;
    
    const categories = items
      .map(item => item.category)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    
    return categories;
  };
  
  return {
    menuItems,
    allMenuItems, // Expose all menu items
    loading: loading || menuLoading,
    error: error || menuError,
    selectedCategories,
    searchTerm,
    loadMenu,
    toggleCategory,
    setSearchTerm,
    resetFilters,
    getCategories
  };
};

export default useMenu;
