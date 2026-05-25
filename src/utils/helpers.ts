import type { MenuItem } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPrice = (price: unknown, currency = '$'): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0.00`;
  }
  return `${currency}${price.toFixed(2)}`;
};

export const capitalizeWords = (str: string | null | undefined): string => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

type FilterableItem = Pick<MenuItem, 'name' | 'description' | 'category'>;

export const filterMenuItems = <T extends FilterableItem>(
  items: T[] | null | undefined,
  searchTerm: string | null | undefined
): T[] | null | undefined => {
  if (!searchTerm || !Array.isArray(items)) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    item.name?.toLowerCase().includes(term) ||
    item.description?.toLowerCase().includes(term) ||
    item.category?.toLowerCase().includes(term)
  );
};

export const getInitials = (firstName = '', lastName = ''): string => {
  const firstInitial = firstName.charAt(0).toUpperCase() || '';
  const lastInitial = lastName.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}` || 'U';
};

export const MENU_IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/';

export interface Category {
  id: string;
  title: string;
}

export const CATEGORIES: Category[] = [
  { id: 'starters', title: 'Starters' },
  { id: 'mains', title: 'Mains' },
  { id: 'desserts', title: 'Desserts' },
  { id: 'beverages', title: 'Beverages' },
];
