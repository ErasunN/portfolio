'use client'
import React, { useRef, useState, useCallback, useEffect, JSX } from 'react'
import { motion, useSpring, useTransform, SpringOptions } from 'motion/react'
import { cn } from '@/utils/css'

/**
 * Componente Spotlight
 * 
 * Un componente que crea un efecto de foco luminoso que sigue al cursor del mouse.
 * Ideal para agregar interactividad y efectos visuales sutiles a secciones de la interfaz.
 * 
 * Características:
 * - Seguimiento suave del cursor
 * - Efecto de desvanecimiento al entrar/salir
 * - Personalización de tamaño y animación
 * - Efecto de gradiente radial
 * - Soporte para tema claro/oscuro
 * 
 * @ejemplo
 * ```tsx
 * <Spotlight 
 *   size={200}
 *   springOptions={{ bounce: 0 }}
 *   className="custom-class"
 * />
 * ```
 */

/**
 * Props del componente Spotlight
 * @typedef {Object} SpotlightProps
 * @property {string} [className] - Clases CSS opcionales para personalización
 * @property {number} [size=200] - Tamaño del foco en píxeles
 * @property {SpringOptions} [springOptions] - Opciones de animación del spring
 */
export type SpotlightProps = {
  className?: string
  size?: number
  springOptions?: SpringOptions
}

/**
 * Componente principal que crea el efecto de foco
 * @param {SpotlightProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente renderizado
 */
export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps): JSX.Element {
  // Referencia al contenedor del spotlight
  const containerRef = useRef<HTMLDivElement>(null)
  // Estado para controlar si el mouse está sobre el área
  const [isHovered, setIsHovered] = useState(false)
  // Estado para almacenar el elemento padre
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

  // Valores animados para la posición del spotlight
  const mouseX = useSpring(0, springOptions)
  const mouseY = useSpring(0, springOptions)

  // Transformación de las coordenadas del mouse a posiciones CSS
  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  // Configuración inicial del elemento padre
  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement
      if (parent) {
        parent.style.position = 'relative'
        parent.style.overflow = 'hidden'
        setParentElement(parent)
      }
    }
  }, [])

  // Manejador del movimiento del mouse
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return
      const { left, top } = parentElement.getBoundingClientRect()
      mouseX.set(event.clientX - left)
      mouseY.set(event.clientY - top)
    },
    [mouseX, mouseY, parentElement],
  )

  // Configuración de los event listeners
  useEffect(() => {
    if (!parentElement) return

    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', () => setIsHovered(true))
    parentElement.addEventListener('mouseleave', () => setIsHovered(false))

    // Limpieza de event listeners
    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true))
      parentElement.removeEventListener('mouseleave', () => setIsHovered(false))
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800',
        isHovered ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  )
}
