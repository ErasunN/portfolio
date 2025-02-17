"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface AnimatedBackgroundProps {
  // Valor seleccionado actualmente
  defaultValue?: string
  // Configuración de la animación
  transition?: {
    type: string
    bounce?: number
    duration: number
  }
  // Habilitar efecto hover
  enableHover?: boolean
  // Clases CSS opcionales para el contenedor
  className?: string
  // Contenido (botones de tema)
  children: React.ReactNode
  // Función que se ejecuta cuando cambia el valor
  onValueChange?: (value: string) => void
}

interface ChildProps {
  "data-id": string;
  "data-checked"?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Componente AnimatedBackground
 * 
 * Este componente crea un fondo animado que se mueve según la selección
 * del tema y maneja las interacciones del usuario.
 * 
 * @param defaultValue - Valor actual seleccionado
 * @param transition - Configuración de la animación
 * @param enableHover - Habilitar efecto hover
 * @param className - Clases CSS opcionales
 * @param children - Elementos hijos (botones de tema)
 * @param onValueChange - Callback cuando cambia el valor
 */
export default function AnimatedBackground({
  defaultValue,
  transition = {
    type: "spring",
    bounce: 0.15,
    duration: 0.5
  },
  enableHover = true,
  className = "",
  children,
  onValueChange
}: AnimatedBackgroundProps) {
  const { theme } = useTheme()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(defaultValue || null)

  // Actualizar el ID seleccionado cuando cambia el valor por defecto
  useEffect(() => {
    setSelectedId(defaultValue || null)
  }, [defaultValue])

  const handleMouseEnter = (id: string) => {
    if (enableHover) {
      setHoveredId(id)
    }
  }

  const handleMouseLeave = () => {
    if (enableHover) {
      setHoveredId(null)
    }
  }

  const handleClick = (id: string) => {
    setSelectedId(id)
    onValueChange?.(id)
  }

  // Procesar los hijos para añadir atributos y eventos
  const processedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement<ChildProps>(child)) return child

    const id = child.props["data-id"]
    if (!id) return child
    return React.cloneElement(child, {
      "data-checked": (hoveredId || selectedId) === id,
      onMouseEnter: () => handleMouseEnter(id),
      onMouseLeave: handleMouseLeave,
      onClick: () => handleClick(id),
      style: { pointerEvents: "auto" }
    })
  })

  // Encontrar el elemento activo para la animación
  const activeChild = React.Children.toArray(children).find(
    (child) => {
      if (!React.isValidElement(child)) return false;
      const props = child.props as { "data-id"?: string };
      return props["data-id"] === (hoveredId || selectedId);
    }
  )

  const activeRect = activeChild && React.isValidElement(activeChild)
    ? document.querySelector(`[data-id="${hoveredId || selectedId}"]`)?.getBoundingClientRect()
    : null

  return (
    <div className={`${className}`}>
      {processedChildren}
      {activeRect && (
        <motion.div
          className="absolute inset-0 bg-zinc-100/40 dark:bg-zinc-800/40 backdrop-blur-sm rounded-lg border border-zinc-900/10 dark:border-white/10 shadow-lg"
          initial={false}
          animate={{
            width: activeRect.width,
            height: activeRect.height,
            x: activeRect.x - (activeRect.width / 2),
            y: activeRect.y - (activeRect.height / 2)
          }}
          transition={transition}
          key={theme}
        />
      )}
    </div>
  )
}
