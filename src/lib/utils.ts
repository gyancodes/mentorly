import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges CSS class names using clsx and tailwind-merge
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string optimized for Tailwind CSS
 * 
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-4', { 'bg-red-500': isError })
 * // Returns: 'py-1 px-4 bg-red-500' (if isError is true)
 * 
 * cn('text-sm', undefined, 'text-lg')
 * // Returns: 'text-lg' (tailwind-merge handles conflicting classes)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
