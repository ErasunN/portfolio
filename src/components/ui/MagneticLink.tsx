"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"

interface MagneticLinkProps {
  children: React.ReactNode
  href: string
  className?: string
}

export default function MagneticLink({ children, href, className }: MagneticLinkProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    
    setPosition({ x, y })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{
        x: position.x * 0.3,
        y: position.y * 0.3,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.a>
  )
}
