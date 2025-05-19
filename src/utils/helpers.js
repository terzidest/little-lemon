/**
 * Base URL for menu item images
 */
export const MENU_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/';

/**
 * Menu categories
 */
export const CATEGORIES = [
  { id: 'starters', title: 'Starters' },
  { id: 'mains', title: 'Mains' },
  { id: 'desserts', title: 'Desserts' },
  { id: 'drinks', title: 'Drinks' },
  { id: 'specials', title: 'Specials' }
];

/**
 * Get initials from first and last name
 * 
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials (2 letters max)
 */
export const getInitials = (firstName = '', lastName = '') => {
  const firstInitial = firstName.trim().charAt(0).toUpperCase() || '';
  const lastInitial = lastName.trim().charAt(0).toUpperCase() || '';
  
  return `${firstInitial}${lastInitial}`;
};

/**
 * Validate email address format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number format
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const validatePhoneNumber = (phone) => {
  // Simple check for numbers, spaces, dashes, parentheses
  const re = /^[0-9\s\-\(\)]+$/;
  return phone.length >= 10 && re.test(phone);
};

/**
 * Format price as currency
 * 
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = '$') => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Format phone number for display
 * 
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  return phone;
};

/**
 * Truncate text with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
