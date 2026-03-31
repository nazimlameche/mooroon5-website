import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useAnimation } from 'framer-motion'
import { Crown, Sparkles } from 'lucide-react'
import logoUrl from '../assets/logo.png'

const members = ['Nazim', 'Basile', 'Maia', 'Gabriel', 'Tieoule', 'Thomas']

/* ─── Animated Member Name ─── */
function MagicName({ name, index }: { name: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useReducedMotion()

  return (
    <motion.span
      className="magic-name text-lg md:text-xl tracking-wide inline-block px-1 py-0.5"
      style={{
        fontFamily: 'var(--font-display)',
        color: 'var(--color-parchment-dark)',
      }}
      initial={reducedMotion ? undefined : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.12, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={
        reducedMotion
          ? undefined
          : {
              color: '#c9a84c',
              textShadow: '0 0 20px rgba(201,168,76,0.6), 0 0 40px rgba(201,168,76,0.3)',
              scale: 1.08,
            }
      }
    >
      {name}

      {/* Shimmer sweep on hover */}
      <motion.span
        className="shimmer-layer"
        animate={
          hovered && !reducedMotion
            ? { backgroundPosition: ['200% center', '-200% center'] }
            : { backgroundPosition: '-200% center' }
        }
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Sparkle icon on hover */}
      <AnimatePresence>
        {hovered && !reducedMotion && (
          <motion.span
            className="absolute -top-3 -right-2"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            transition={{ duration: 0.25 }}
          >
            <Sparkles
              className="w-3.5 h-3.5"
              style={{
                color: 'var(--color-gold-light)',
                filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.6))',
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  )
}

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const crestControls = useAnimation()

  function handleCrestHover() {
    if (reducedMotion) return
    crestControls
      .start({ rotateY: 360, transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] } })
      .then(() => crestControls.set({ rotateY: 0 }))
  }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(107, 29, 42, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%, rgba(45, 74, 62, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(201, 168, 76, 0.05) 0%, transparent 50%),
          var(--color-bg-deep)
        `,
      }}
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,9,8,0.7) 100%)',
        }}
      />

      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-gold), var(--color-gold-light), var(--color-gold), transparent)',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={reducedMotion ? undefined : container}
        initial="hidden"
        animate="show"
      >
        {/* Logo with Crest Frame */}
        <motion.div className="relative mb-8" variants={reducedMotion ? undefined : fadeUp}>
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-15"
            style={{ background: 'var(--color-gold)', transform: 'scale(1.5)' }}
          />

          {/* Outer wrapper: stable hit area that doesn't rotate */}
          <div onMouseEnter={handleCrestHover} style={{ perspective: '800px', perspectiveOrigin: 'center center' }}>
          {/* Crest frame — 3D spins as one unit, driven by crestControls */}
          <motion.div
            className="crest-frame relative"
            animate={crestControls}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
          >
            {/* Top crest ornament — Crown */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              <Crown
                className="w-7 h-7"
                style={{
                  color: 'var(--color-gold)',
                  filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.5))',
                }}
              />
            </div>

            {/* Shield-shaped border overlay */}
            <div
              className="absolute inset-[-4px] z-10 pointer-events-none"
              style={{
                border: '2px solid var(--color-gold-dim)',
                borderRadius: '12px 12px 50% 50% / 10px 10px 40% 40%',
                opacity: 0.5,
              }}
            />

            {/* Decorative side flourishes */}
            <div
              className="absolute top-1/2 -left-6 w-5 h-px z-10"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-dim))' }}
            />
            <div
              className="absolute top-1/2 -right-6 w-5 h-px z-10"
              style={{ background: 'linear-gradient(270deg, transparent, var(--color-gold-dim))' }}
            />

            {/* Bottom point ornament */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 z-10"
              style={{ border: '1px solid var(--color-gold-dim)', background: 'var(--color-bg-deep)' }}
            />

            <img
              src={logoUrl}
              alt="Mooroon5 Logo"
              className="relative w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl candle-flicker"
            />
          </motion.div>
          </div>
        </motion.div>

        {/* Team Name */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            textShadow: '0 0 40px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.8)',
          }}
          variants={reducedMotion ? undefined : fadeUp}
        >
          Mooroon5
        </motion.h1>

        <motion.div className="golden-divider" variants={reducedMotion ? undefined : fadeUp} />

        {/* Members */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 mb-10"
          variants={reducedMotion ? undefined : fadeUp}
        >
          {members.map((name, i) => (
            <MagicName key={name} name={name} index={i} />
          ))}
        </motion.div>

        {/* Citation */}
        <motion.div className="relative mt-4 mb-8" variants={reducedMotion ? undefined : fadeUp}>
          <div
            className="absolute inset-0 -inset-x-8 -inset-y-4 rounded"
            style={{
              border: '1px solid var(--color-gold-dim)',
              opacity: 0.4,
            }}
          />
          <p
            className="relative text-xl md:text-2xl italic tracking-widest px-8 py-3"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gold-light)',
              textShadow: '0 0 20px rgba(201,168,76,0.2)',
            }}
          >
            &ldquo;Be better be Moore&rdquo;
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-parchment-dim)' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-8"
          style={{
            background: 'linear-gradient(to bottom, var(--color-gold-dim), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
