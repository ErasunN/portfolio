
import { cn } from '@/utils/css'
import { AnimatePresence, Variants, motion, Transition } from 'motion/react'
import React from 'react'

// Definición de tipos para las props del componente
export type PerType = 'word' | 'char' | 'line'
export type PresetType = 'fade' | 'blur' | 'scale' | 'fade-in-blur' | 'slide'

export type TextEffectProps = {
    children: string // Texto a animar
    per?: PerType // Tipo de segmentación: 'word', 'char' o 'line'
    as?: keyof React.JSX.IntrinsicElements // Elemento HTML contenedor ('p', 'span', etc.)
    variants?: { container?: Variants; item?: Variants } // Variantes personalizadas de animación
    className?: string // Clases adicionales
    preset?: PresetType // Tipo de animación predefinida ('fade', 'blur', etc.)
    delay?: number // Retardo antes de iniciar la animación
    speedReveal?: number // Velocidad de la animación de aparición
    speedSegment?: number // Velocidad de animación por segmento
    trigger?: boolean // Si debe ejecutarse la animación o no
    onAnimationComplete?: () => void // Callback al terminar la animación
    onAnimationStart?: () => void // Callback al iniciar la animación
    segmentWrapperClassName?: string // Clases para el wrapper de cada segmento
    containerTransition?: Transition // Transición personalizada para el contenedor
    segmentTransition?: Transition // Transición personalizada para los segmentos
    style?: React.CSSProperties // Estilos en línea
}

// Tiempos de retardo entre elementos animados según la segmentación
const defaultStaggerTimes: Record<PerType, number> = {
    char: 0.03,
    word: 0.05,
    line: 0.1,
}

// Variantes predeterminadas de animación
const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
    exit: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
}

const defaultItemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

// Animaciones predefinidas
const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
    blur: {
        container: defaultContainerVariants,
        item: { hidden: { opacity: 0, filter: 'blur(12px)' }, visible: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(12px)' } },
    },
    'fade-in-blur': {
        container: defaultContainerVariants,
        item: { hidden: { opacity: 0, y: 20, filter: 'blur(12px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: 20, filter: 'blur(12px)' } },
    },
    scale: {
        container: defaultContainerVariants,
        item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0 } },
    },
    fade: {
        container: defaultContainerVariants,
        item: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
    },
    slide: {
        container: defaultContainerVariants,
        item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } },
    },
}

// Función para dividir el texto según la segmentación elegida
const splitText = (text: string, per: PerType) => {
    if (per === 'line') return text.split('\n')
    return text.split(/(\s+)/)
}

// Función para aplicar transiciones personalizadas
const createVariantsWithTransition = (baseVariants: Variants, transition?: Transition & { exit?: Transition }): Variants => {
    if (!transition) return baseVariants
    return {
        ...baseVariants,
        visible: { ...baseVariants.visible, transition: { ...transition } },
        exit: { ...baseVariants.exit, transition: { ...transition, staggerDirection: -1 } },
    }
}

// Componente principal TextEffect
export function TextEffect({ children, per = 'word', as = 'p', variants, className, preset = 'fade', delay = 0, speedReveal = 1, speedSegment = 1, trigger = true, onAnimationComplete, onAnimationStart, segmentWrapperClassName, containerTransition, segmentTransition, style }: TextEffectProps) {
    const segments = splitText(children, per)
    const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

    // Definir variantes base o predefinidas
    const baseVariants = preset ? presetVariants[preset] : { container: defaultContainerVariants, item: defaultItemVariants }

    // Aplicar transiciones personalizadas
    const computedVariants = {
        container: createVariantsWithTransition(variants?.container || baseVariants.container, { staggerChildren: defaultStaggerTimes[per] / speedReveal, delayChildren: delay, ...containerTransition }),
        item: createVariantsWithTransition(variants?.item || baseVariants.item, { duration: 0.3 / speedSegment, ...segmentTransition }),
    }

    return (
        <AnimatePresence mode="popLayout">
            {trigger && (
                <MotionTag initial="hidden" animate="visible" exit="exit" variants={computedVariants.container} className={className} onAnimationComplete={onAnimationComplete} onAnimationStart={onAnimationStart} style={style}>
                    {per !== 'line' ? <span className="sr-only">{children}</span> : null}
                    {segments.map((segment, index) => (
                        <motion.span key={`${per}-${index}-${segment}`} variants={computedVariants.item} className={cn(per === 'line' ? 'block' : 'inline-block', segmentWrapperClassName)}>
                            {segment}
                        </motion.span>
                    ))}
                </MotionTag>
            )}
        </AnimatePresence>
    )
}
