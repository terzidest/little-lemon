import { useState } from 'react';
import { useStore } from '../store/useStore';

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
    resetFilters,
  } = useStore((state) => ({
    menuItems: state.menuItems,
    allMenuItems: state.allMenuItems,
    menuLoading: state.menuLoading,
    menuError: state.menuError,
    selectedCategories: state.selectedCategories,
    searchTerm: state.searchTerm,
    fetchMenu: state.fetchMenu,
    toggleCategory: state.toggleCategory,
    setSearchTerm: state.setSearchTerm,
    resetFilters: state.resetFilters,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMenu = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await fetchMenu();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load menu items';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = (): string[] => {
    const items = allMenuItems.length > 0 ? allMenuItems : menuItems;
    return items
      .map(item => item.category)
      .filter((value, index, self) => Boolean(value) && self.indexOf(value) === index);
  };

  return {
    menuItems,
    allMenuItems,
    loading: loading || menuLoading,
    error: error || menuError,
    selectedCategories,
    searchTerm,
    loadMenu,
    toggleCategory,
    setSearchTerm,
    resetFilters,
    getCategories,
  };
};

export default useMenu;
