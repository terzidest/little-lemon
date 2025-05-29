import { 
  validateEmail, 
  formatPrice, 
  capitalizeWords, 
  filterMenuItems 
} from '../helpers';

describe('Utility Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatPrice', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(12.99)).toBe('$12.99');
      expect(formatPrice(5)).toBe('$5.00');
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle custom currency', () => {
      expect(formatPrice(12.99, '€')).toBe('€12.99');
      expect(formatPrice(5, '£')).toBe('£5.00');
    });

    it('should handle invalid inputs', () => {
      expect(formatPrice(null)).toBe('$0.00');
      expect(formatPrice(undefined)).toBe('$0.00');
      expect(formatPrice('invalid')).toBe('$0.00');
      expect(formatPrice(NaN)).toBe('$0.00');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize words correctly', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('UPPERCASE TEXT')).toBe('Uppercase Text');
      expect(capitalizeWords('mixed CaSe')).toBe('Mixed Case');
    });

    it('should handle edge cases', () => {
      expect(capitalizeWords('')).toBe('');
      expect(capitalizeWords(null)).toBe('');
      expect(capitalizeWords(undefined)).toBe('');
      expect(capitalizeWords('single')).toBe('Single');
    });
  });

  describe('filterMenuItems', () => {
    const mockMenuItems = [
      { 
        id: 1, 
        name: 'Greek Salad', 
        description: 'Fresh vegetables with feta', 
        category: 'starters' 
      },
      { 
        id: 2, 
        name: 'Pasta Primavera', 
        description: 'Pasta with seasonal vegetables', 
        category: 'mains' 
      },
      { 
        id: 3, 
        name: 'Chocolate Cake', 
        description: 'Rich chocolate dessert', 
        category: 'desserts' 
      },
    ];

    it('should filter by name', () => {
      const result = filterMenuItems(mockMenuItems, 'Greek');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Greek Salad');
    });

    it('should filter by description', () => {
      const result = filterMenuItems(mockMenuItems, 'vegetables');
      expect(result).toHaveLength(2);
    });

    it('should filter by category', () => {
      const result = filterMenuItems(mockMenuItems, 'desserts');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chocolate Cake');
    });

    it('should be case insensitive', () => {
      const result = filterMenuItems(mockMenuItems, 'PASTA');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Pasta Primavera');
    });

    it('should handle edge cases', () => {
      expect(filterMenuItems(mockMenuItems, '')).toEqual(mockMenuItems);
      expect(filterMenuItems(mockMenuItems, null)).toEqual(mockMenuItems);
      expect(filterMenuItems([], 'test')).toEqual([]);
      expect(filterMenuItems(null, 'test')).toBeNull();
    });
  });
});
