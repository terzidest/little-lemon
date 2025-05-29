// Simple utility functions for the app

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats price with currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0.00`;
  }
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Capitalizes first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Filters menu items by search term
 * @param {Array} items - Menu items array
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered items
 */
export const filterMenuItems = (items, searchTerm) => {
  if (!searchTerm || !Array.isArray(items)) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.name?.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term) ||
    item.category?.toLowerCase().includes(term)
  );
};
