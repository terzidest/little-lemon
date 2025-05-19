import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * A utility function that merges Tailwind CSS classes
 * using clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
