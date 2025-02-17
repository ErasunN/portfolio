import { RefObject, useEffect } from 'react'

/**
 * Un hook personalizado de React que maneja los clics fuera de un elemento específico
 * 
 * @param ref - Un objeto ref de React que apunta al elemento a monitorear para clics externos
 * @param handler - Función callback que se ejecutará cuando ocurra un clic fuera del elemento referenciado
 * 
 * @example
 * ```tsx
 * const miRef = useRef(null);
 * useClickOutside(miRef, () => {
 *   // Manejar clic externo
 *   setEstaAbierto(false);
 * });
 * ```
 * 
 * Este hook es útil para implementar menús desplegables, modales o cualquier elemento de UI 
 * que deba cerrarse al hacer clic fuera de él. Maneja tanto clics del mouse como eventos táctiles.
 */
function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref || !ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, handler])
}

export default useClickOutside
