import { ClassValue, clsx } from 'clsx' // clsx maneja clases condicionales
import { twMerge } from 'tailwind-merge' // twMerge resuelve conflictos de clases de Tailwind

/**
 * Combina múltiples valores de clases CSS y resuelve conflictos en clases de Tailwind.
 *
 * @param inputs - Lista de valores que pueden ser strings, arrays u objetos de clases.
 * @returns String con las clases combinadas y sin duplicados/conflictos.
 *
 * @example
 * cn('p-4', 'bg-red-500', 'hidden', { 'block': isVisible }) 
 * // Retorna: "p-4 bg-red-500 block" (si `isVisible` es true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) // Procesa las clases con clsx y optimiza con twMerge
}
