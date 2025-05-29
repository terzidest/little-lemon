import { renderHook } from '@testing-library/react-native';
import useMenu from '../useMenu';
import { useStore } from '../../store/useStore';

// Mock the store
jest.mock('../../store/useStore', () => ({
  useStore: jest.fn(),
}));

describe('useMenu Hook', () => {
  const mockStore = {
    menuItems: [
      {
        id: 1,
        name: 'Greek Salad',
        price: 12.99,
        description: 'Fresh vegetables with feta cheese',
        category: 'starters',
        image: 'greek-salad.jpg',
      },
      {
        id: 2,
        name: 'Bruschetta',
        price: 5.99,
        description: 'Grilled bread with tomatoes',
        category: 'starters',
        image: 'bruschetta.jpg',
      },
    ],
    allMenuItems: [],
    menuLoading: false,
    menuError: null,
    selectedCategories: [],
    searchTerm: '',
    fetchMenu: jest.fn(),
    toggleCategory: jest.fn(),
    setSearchTerm: jest.fn(),
    resetFilters: jest.fn(),
  };

  beforeEach(() => {
    useStore.mockReturnValue(mockStore);
    jest.clearAllMocks();
  });

  it('should return menu data from store', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.menuItems).toEqual(mockStore.menuItems);
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.searchTerm).toBe('');
  });

  it('should call fetchMenu when loadMenu is called', async () => {
    const { result } = renderHook(() => useMenu());

    await result.current.loadMenu();

    expect(mockStore.fetchMenu).toHaveBeenCalledTimes(1);
  });

  it('should return unique categories from menu items', () => {
    const { result } = renderHook(() => useMenu());

    const categories = result.current.getCategories();

    expect(categories).toEqual(['starters']);
  });

  it('should handle loading state correctly', () => {
    useStore.mockReturnValue({
      ...mockStore,
      menuLoading: true,
    });

    const { result } = renderHook(() => useMenu());

    expect(result.current.loading).toBe(true);
  });

  it('should handle error state correctly', () => {
    const errorMessage = 'Failed to load menu';
    useStore.mockReturnValue({
      ...mockStore,
      menuError: errorMessage,
    });

    const { result } = renderHook(() => useMenu());

    expect(result.current.error).toBe(errorMessage);
  });
});
