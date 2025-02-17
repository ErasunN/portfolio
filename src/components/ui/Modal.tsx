'use client'

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Transition,
  Variant,
} from 'motion/react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/css'
import { XIcon } from 'lucide-react'
import useClickOutside from '@/hooks/useClickOutside'

/**
 * Componente MorphingModal
 * 
 * Un componente de modal flexible y accesible que soporta animaciones de transformación
 * entre estados de disparador y contenido. Construido con Framer Motion para transiciones
 * suaves y sigue los patrones de diálogo WAI-ARIA para accesibilidad.
 * 
 * @ejemplo
 * ```tsx
 * <MorphingModal>
 *   <MorphingModalTrigger>Abrir Modal</MorphingModalTrigger>
 *   <MorphingModalContainer>
 *     <MorphingModalContent>
 *       <MorphingModalTitle>Título del Modal</MorphingModalTitle>
 *       <MorphingModalDescription>Contenido del modal</MorphingModalDescription>
 *       <MorphingModalClose />
 *     </MorphingModalContent>
 *   </MorphingModalContainer>
 * </MorphingModal>
 * ```
 */

/**
 * Tipo de contexto para el componente MorphingModal
 * @typedef {Object} MorphingModalContextType
 * @property {boolean} isOpen - Current state of the dialog
 * @property {Function} setIsOpen - Function to update the dialog state
 * @property {string} uniqueId - Unique identifier for the dialog
 * @property {React.RefObject<HTMLDivElement>} triggerRef - Reference to the trigger element
 */
export type MorphingModalContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  uniqueId: string
  triggerRef: React.RefObject<HTMLDivElement>
}

const MorphingModalContext =
  React.createContext<MorphingModalContextType | null>(null)

function useMorphingModal() {
  const context = useContext(MorphingModalContext)
  if (!context) {
    throw new Error(
      'useMorphingModal must be used within a MorphingModalProvider',
    )
  }
  return context
}

export type MorphingModalProviderProps = {
  children: React.ReactNode
  transition?: Transition
}

function MorphingModalProvider({
  children,
  transition,
}: MorphingModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const uniqueId = useId()
  const triggerRef = useRef<HTMLDivElement>(null!)

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
    }),
    [isOpen, uniqueId],
  )

  return (
    <MorphingModalContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingModalContext.Provider>
  )
}

/**
 * Main MorphingModal component that provides the dialog functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {Transition} [props.transition] - Optional animation transition configuration
 */
export type MorphingModalProps = {
  children: React.ReactNode
  transition?: Transition
}

function MorphingModal({ children, transition }: MorphingModalProps) {
  return (
    <MorphingModalProvider>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingModalProvider>
  )
}

/**
 * Trigger component that opens/closes the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 * @param {React.RefObject<HTMLDivElement>} [props.triggerRef] - Optional ref for the trigger element
 */
export type MorphingModalTriggerProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  triggerRef?: React.RefObject<HTMLDivElement>
}

function MorphingModalTrigger({
  children,
  className,
  style,
  triggerRef,
}: MorphingModalTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingModal()

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen],
  )

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('relative cursor-pointer', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * Content container for the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 */
export type MorphingModalContentProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingModalContent({
  children,
  className,
  style,
}: MorphingModalContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingModal()
  const containerRef = useRef<HTMLDivElement>(null!)
  const [firstFocusableElement, setFirstFocusableElement] =
    useState<HTMLElement | null>(null)
  const [lastFocusableElement, setLastFocusableElement] =
    useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
      if (event.key === 'Tab') {
        if (!firstFocusableElement || !lastFocusableElement) return

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault()
            lastFocusableElement.focus()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault()
            firstFocusableElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setIsOpen, firstFocusableElement, lastFocusableElement])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement)
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement,
        )
        ;(focusableElements[0] as HTMLElement).focus()
      }
    } else {
      document.body.classList.remove('overflow-hidden')
      triggerRef.current?.focus()
    }
  }, [isOpen, triggerRef])

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('overflow-hidden', className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * Container that handles the portal and backdrop for the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 */
export type MorphingModalContainerProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingModalContainer({ children }: MorphingModalContainerProps) {
  const { isOpen, uniqueId } = useMorphingModal()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-sm dark:bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/**
 * Title component for the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 */
export type MorphingModalTitleProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingModalTitle({
  children,
  className,
  style,
}: MorphingModalTitleProps) {
  const { uniqueId } = useMorphingModal()

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  )
}

/**
 * Subtitle component for the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 */
export type MorphingModalSubtitleProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function MorphingModalSubtitle({
  children,
  className,
  style,
}: MorphingModalSubtitleProps) {
  const { uniqueId } = useMorphingModal()

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/**
 * Description component for the dialog content
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Optional CSS classes
 * @param {boolean} [props.disableLayoutAnimation] - Option to disable layout animations
 * @param {Object} [props.variants] - Animation variants for the description
 */
export type MorphingModalDescriptionProps = {
  children: React.ReactNode
  className?: string
  disableLayoutAnimation?: boolean
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function MorphingModalDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: MorphingModalDescriptionProps) {
  const { uniqueId } = useMorphingModal()

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * Image component for the dialog
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} [props.className] - Optional CSS classes
 * @param {React.CSSProperties} [props.style] - Optional inline styles
 */
export type MorphingModalImageProps = {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

function MorphingModalImage({
  src,
  alt,
  className,
  style,
}: MorphingModalImageProps) {
  const { uniqueId } = useMorphingModal()

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  )
}

/**
 * Close button component for the dialog
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional custom close button content
 * @param {string} [props.className] - Optional CSS classes
 * @param {Object} [props.variants] - Animation variants for the close button
 */
export type MorphingModalCloseProps = {
  children?: React.ReactNode
  className?: string
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
}

function MorphingModalClose({
  children,
  className,
  variants,
}: MorphingModalCloseProps) {
  const { setIsOpen, uniqueId } = useMorphingModal()

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn('absolute top-6 right-6', className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <XIcon size={24} />}
    </motion.button>
  )
}

export {
  MorphingModal,
  MorphingModalTrigger,
  MorphingModalContainer,
  MorphingModalContent,
  MorphingModalClose,
  MorphingModalTitle,
  MorphingModalSubtitle,
  MorphingModalDescription,
  MorphingModalImage,
}
