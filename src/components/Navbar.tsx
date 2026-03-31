import { motion, useReducedMotion } from 'framer-motion'
import logoUrl from '../assets/logo.png'

const navItems = [
  { label: 'About', href: '#hero' },
  { label: 'Grimoire', href: '#tools' },
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
}

export default function Navbar() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 py-3"
      style={{
        background: 'rgba(10,9,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
      variants={reducedMotion ? undefined : navVariants}
      initial="hidden"
      animate="show"
    >
      {/* Logo + name — links back to top */}
      <a href="#hero" className="flex items-center gap-3 group">
        <img
          src={logoUrl}
          alt="Mooroon5"
          className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />
        <span
          className="text-sm tracking-[0.15em] uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
          }}
        >
          Mooroon5
        </span>
      </a>

      {/* Nav links */}
      <nav className="flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="relative text-xs uppercase tracking-[0.25em] transition-colors duration-200 group"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-parchment-dim)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gold)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-parchment-dim)'
            }}
          >
            {item.label}
            {/* Underline on hover */}
            <span
              className="absolute -bottom-0.5 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
              style={{ background: 'var(--color-gold-dim)' }}
            />
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
