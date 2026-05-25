import type { StateCreator } from 'zustand';
import type { StoreState, MenuState, MenuActions } from '../types';
import type { MenuItem } from '../../types';
import { fetchMenuItems, filterMenuItems } from '../../firebase/firestore';

export type MenuSlice = MenuState & MenuActions;

const createMenuSlice: StateCreator<StoreState, [], [], MenuSlice> = (set, get) => ({
  menuItems: [],
  allMenuItems: [],
  selectedCategories: [],
  searchTerm: '',
  menuLoading: false,
  menuError: null,

  setMenuLoading: (menuLoading) => set({ menuLoading }),
  setMenuError: (menuError) => set({ menuError }),
  resetMenuError: () => set({ menuError: null }),

  fetchMenu: async () => {
    try {
      set({ menuLoading: true });
      const { selectedCategories, searchTerm, allMenuItems } = get();

      if (allMenuItems.length > 0 && (selectedCategories.length > 0 || searchTerm.length > 0)) {
        let filteredItems = [...allMenuItems];

        if (selectedCategories.length > 0) {
          filteredItems = filteredItems.filter(
            item => item.category && item.category.toLowerCase() === selectedCategories[0]
          );
        }

        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          filteredItems = filteredItems.filter(
            item =>
              (item.name && item.name.toLowerCase().includes(lower)) ||
              (item.description && item.description.toLowerCase().includes(lower))
          );
        }

        set({ menuItems: filteredItems, menuLoading: false, menuError: null });
        return true;
      }

      let menuItems: MenuItem[];

      if (selectedCategories.length > 0 || searchTerm.length > 0) {
        const categoryFilter = selectedCategories.length > 0 ? [selectedCategories[0]] : [];
        menuItems = await filterMenuItems(categoryFilter, searchTerm);
      } else {
        menuItems = await fetchMenuItems();
        set({ allMenuItems: menuItems });
      }

      set({ menuItems, menuLoading: false, menuError: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching menu';
      set({ menuLoading: false, menuError: message });
      return false;
    }
  },

  setMenuItems: (items) => {
    const validItems = items.filter(item => item && typeof item === 'object');
    set({ menuItems: validItems, allMenuItems: validItems });
  },

  toggleCategory: (category) => {
    const { selectedCategories } = get();
    if (selectedCategories.includes(category)) {
      set({ selectedCategories: [] });
    } else {
      set({ selectedCategories: [category] });
    }
    get().fetchMenu();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().fetchMenu();
  },

  resetFilters: () => {
    set({ selectedCategories: [], searchTerm: '' });
    get().fetchMenu();
  },
});

export default createMenuSlice;
