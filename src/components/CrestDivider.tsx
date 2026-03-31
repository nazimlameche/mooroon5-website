import { motion, useReducedMotion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'

interface CrestDividerProps {
  icon: LucideIcon
  className?: string
}

export default function CrestDivider({ icon: Icon, className = '' }: CrestDividerProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`relative flex items-center justify-center py-12 md:py-16 px-6 ${className}`}
      initial={reducedMotion ? undefined : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Left ornamental line */}
      <div className="flex items-center flex-1 max-w-[200px] md:max-w-[280px]">
        <div
          className="h-px flex-1"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-gold-dim))',
          }}
        />
        {/* Left diamond */}
        <div
          className="w-2 h-2 rotate-45 mx-2 shrink-0"
          style={{
            border: '1px solid var(--color-gold-dim)',
            background: 'var(--color-bg-deep)',
          }}
        />
        <div
          className="h-px w-6 shrink-0"
          style={{ background: 'var(--color-gold-dim)' }}
        />
      </div>

      {/* Center icon with ornate frame */}
      <div className="relative mx-4 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute w-14 h-14 rounded-full"
          style={{
            border: '1px solid var(--color-gold-dim)',
            opacity: 0.4,
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute w-10 h-10 rounded-full"
          style={{
            border: '1px solid var(--color-gold-dim)',
            opacity: 0.6,
          }}
        />
        {/* Icon */}
        <Icon
          className="w-5 h-5 relative z-10"
          style={{
            color: 'var(--color-gold)',
            filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.4))',
          }}
        />
      </div>

      {/* Right ornamental line */}
      <div className="flex items-center flex-1 max-w-[200px] md:max-w-[280px]">
        <div
          className="h-px w-6 shrink-0"
          style={{ background: 'var(--color-gold-dim)' }}
        />
        {/* Right diamond */}
        <div
          className="w-2 h-2 rotate-45 mx-2 shrink-0"
          style={{
            border: '1px solid var(--color-gold-dim)',
            background: 'var(--color-bg-deep)',
          }}
        />
        <div
          className="h-px flex-1"
          style={{
            background: 'linear-gradient(270deg, transparent, var(--color-gold-dim))',
          }}
        />
      </div>
    </motion.div>
  )
}
