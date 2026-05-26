import { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store/useStore';

const useMenu = () => {
  const {
    allMenuItems,
    menuLoading,
    menuError,
    selectedCategories,
    searchTerm,
    fetchMenu,
    toggleCategory,
    setSearchTerm,
    resetFilters,
  } = useStore(
    (state) => ({
      allMenuItems: state.allMenuItems,
      menuLoading: state.menuLoading,
      menuError: state.menuError,
      selectedCategories: state.selectedCategories,
      searchTerm: state.searchTerm,
      fetchMenu: state.fetchMenu,
      toggleCategory: state.toggleCategory,
      setSearchTerm: state.setSearchTerm,
      resetFilters: state.resetFilters,
    }),
    shallow
  );

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

  const menuItems = useMemo(() => {
    let items = allMenuItems;
    if (selectedCategories.length > 0) {
      const category = selectedCategories[0].toLowerCase();
      items = items.filter((item) => item.category?.toLowerCase() === category);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(lower) ||
          item.description?.toLowerCase().includes(lower)
      );
    }
    return items;
  }, [allMenuItems, selectedCategories, searchTerm]);

  const getCategories = (): string[] =>
    Array.from(
      new Set(allMenuItems.map((item) => item.category).filter((c): c is string => Boolean(c)))
    );

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
