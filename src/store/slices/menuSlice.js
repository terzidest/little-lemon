import { fetchMenuItems, filterMenuItems } from '../../firebase/firestore';

/**
 * Menu store slice
 */
const createMenuSlice = (set, get) => ({
  // Menu state
  menuItems: [],
  allMenuItems: [],  // Keep a copy of all menu items
  selectedCategories: [], // This will now hold only 0 or 1 category
  searchTerm: '',
  menuLoading: false,
  menuError: null,
  
  // Set menu loading state
  setMenuLoading: (menuLoading) => set({ menuLoading }),
  
  // Set menu error
  setMenuError: (menuError) => set({ menuError }),
  
  // Reset menu error
  resetMenuError: () => set({ menuError: null }),
  
  // Fetch menu items from Firestore
  fetchMenu: async () => {
    try {
      set({ menuLoading: true });
      
      // If there are selected categories or a search term, use filtered fetch
      const { selectedCategories, searchTerm, allMenuItems } = get();
      
      // If we already have all menu items and we're just filtering, do it client-side
      if (allMenuItems.length > 0 && (selectedCategories.length > 0 || searchTerm.length > 0)) {
        let filteredItems = [...allMenuItems];
        
        // Filter by category - use only the first selected category
        if (selectedCategories.length > 0) {
          filteredItems = filteredItems.filter(item => 
            item.category && item.category.toLowerCase() === selectedCategories[0]
          );
        }
        
        // Filter by search term
        if (searchTerm) {
          const lowercaseSearchTerm = searchTerm.toLowerCase();
          filteredItems = filteredItems.filter(item => 
            (item.name && item.name.toLowerCase().includes(lowercaseSearchTerm)) ||
            (item.description && item.description.toLowerCase().includes(lowercaseSearchTerm))
          );
        }
        
        set({ 
          menuItems: filteredItems,
          menuLoading: false,
          menuError: null
        });
        
        return true;
      }
      
      // Otherwise fetch from Firestore
      let menuItems;
      
      if (selectedCategories.length > 0 || searchTerm.length > 0) {
        // Use only the first selected category for filtering
        const categoryFilter = selectedCategories.length > 0 ? [selectedCategories[0]] : [];
        menuItems = await filterMenuItems(categoryFilter, searchTerm);
      } else {
        menuItems = await fetchMenuItems();
        // Store all menu items for future filtering
        set({ allMenuItems: menuItems });
      }
      
      set({ 
        menuItems,
        menuLoading: false,
        menuError: null
      });
      
      return true;
    } catch (error) {
      set({ 
        menuLoading: false,
        menuError: error.message || 'Error fetching menu'
      });
      return false;
    }
  },
  
  // Set menu items
  setMenuItems: (items) => {
    // Ensure items are valid and have all required properties
    const validItems = items.filter(item => item && typeof item === 'object');
    set({ 
      menuItems: validItems,
      allMenuItems: validItems  // Store all menu items
    });
  },
  
  // Toggle category selection - now handles single selection
  toggleCategory: (category) => {
    const { selectedCategories } = get();
    
    // If the category is already selected, deselect it
    if (selectedCategories.includes(category)) {
      set({ selectedCategories: [] });
    } else {
      // Otherwise, select only this category (replacing any previous selection)
      set({ selectedCategories: [category] });
    }
    
    // Immediately fetch updated menu with new filters
    get().fetchMenu();
  },
  
  // Set search term
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    
    // In a real app, this would ideally be debounced
    get().fetchMenu();
  },
  
  // Reset filters
  resetFilters: () => {
    set({ 
      selectedCategories: [],
      searchTerm: '',
    });
    
    // Fetch all menu items with no filters
    get().fetchMenu();
  }
});

export default createMenuSlice;
