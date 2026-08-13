import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges CSS class names cleanly using clsx and tailwind-merge
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
