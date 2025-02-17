"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

interface TextLoopProps {
  // Array de textos que se mostrarán en el bucle
  texts: string[]
  // Intervalo en milisegundos entre cada cambio de texto
  interval?: number
  // Clases CSS opcionales para el contenedor
  className?: string
}

/**
 * Componente TextLoop
 * 
 * Este componente crea una animación de texto que alterna entre diferentes palabras
 * o frases en un bucle continuo con transiciones suaves.
 * 
 * @param texts - Array de textos que se mostrarán en secuencia
 * @param interval - Tiempo en ms entre cada cambio de texto (por defecto: 2000ms)
 * @param className - Clases CSS opcionales para estilizar el contenedor
 */
export default function TextLoop({ texts, interval = 2000, className }: TextLoopProps) {
  // Estado para controlar el índice del texto actual
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Configurar el temporizador para cambiar el texto
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, interval)

    // Limpiar el temporizador cuando el componente se desmonte
    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={`h-[1.2em] relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute text-center text-nowrap"
        >
          {texts[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
