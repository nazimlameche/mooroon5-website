import { motion, useReducedMotion } from 'framer-motion'
import { Feather } from 'lucide-react'
import logoUrl from '../assets/logo.png'

export default function Footer() {
  const reducedMotion = useReducedMotion()

  return (
    <footer
      className="relative w-full py-16 px-6"
      style={{
        background: 'linear-gradient(to bottom, var(--color-bg-deep), #060504)',
      }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-gold-dim), transparent)',
        }}
      />

      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center gap-5"
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Logo */}
        <img
          src={logoUrl}
          alt="Mooroon5"
          className="w-16 h-16 object-contain opacity-70"
        />

        {/* Feather quill accent */}
        <Feather
          className="w-5 h-5"
          style={{
            color: 'var(--color-gold-dim)',
            transform: 'rotate(-30deg)',
            opacity: 0.6,
            filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.2))',
          }}
        />

        {/* Text */}
        <p
          className="text-sm tracking-[0.2em] uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-parchment-dim)',
          }}
        >
          Powered by the greatest minds
        </p>

        {/* Small divider */}
        <div
          className="w-8 h-px"
          style={{ background: 'var(--color-gold-dim)' }}
        />

        {/* Copyright */}
        <p
          className="text-xs"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-parchment-dim)',
            opacity: 0.5,
          }}
        >
          Mooroon5 &mdash; {new Date().getFullYear()}
        </p>
      </motion.div>
    </footer>
  )
}
