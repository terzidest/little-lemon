import type { StateCreator } from 'zustand';
import type { StoreState, MenuState, MenuActions } from '../types';
import { fetchMenuItems } from '../../firebase/firestore';

export type MenuSlice = MenuState & MenuActions;

const createMenuSlice: StateCreator<StoreState, [], [], MenuSlice> = (set) => ({
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
      const items = await fetchMenuItems();
      set({ allMenuItems: items, menuLoading: false, menuError: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching menu';
      set({ menuLoading: false, menuError: message });
      return false;
    }
  },

  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category) ? [] : [category],
    })),

  setSearchTerm: (searchTerm) => set({ searchTerm }),

  resetFilters: () => set({ selectedCategories: [], searchTerm: '' }),
});

export default createMenuSlice;
