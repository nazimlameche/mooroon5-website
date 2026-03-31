import { motion, useReducedMotion } from 'framer-motion'
import { Library } from 'lucide-react'

export default function Tools() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="tools"
      className="relative w-full py-24 md:py-32 px-6"
      style={{
        background: `
          linear-gradient(to bottom, var(--color-bg-deep), var(--color-bg-dark) 20%, var(--color-bg-dark) 80%, var(--color-bg-deep))
        `,
      }}
    >
      {/* Section header */}
      <motion.div
        className="max-w-5xl mx-auto text-center mb-16"
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Library
            className="w-7 h-7 shrink-0"
            style={{
              color: 'var(--color-gold)',
              filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.4))',
            }}
          />
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-gold)',
              textShadow: '0 0 30px rgba(201,168,76,0.2)',
            }}
          >
            Our Grimoire of Tools
          </h2>
        </div>
        <div className="golden-divider" />
        <p
          className="mt-4 text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--color-parchment-dim)', fontFamily: 'var(--font-body)' }}
        >
          Each instrument in our collection has been carefully curated for the craft
        </p>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        className="max-w-5xl mx-auto flex flex-col items-center gap-8"
        initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {/* Decorative top line */}
        <div className="flex items-center gap-4 w-full max-w-lg">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-dim))' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: 'var(--color-gold-dim)' }} />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, var(--color-gold-dim))' }} />
        </div>

        <p
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest text-center"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'transparent',
            WebkitTextStroke: '1px var(--color-gold-dim)',
            textShadow: '0 0 60px rgba(201,168,76,0.15)',
          }}
        >
          Coming
        </p>
        <p
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest text-center"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            textShadow: '0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.15)',
          }}
        >
          Soon
        </p>

        {/* Decorative bottom line */}
        <div className="flex items-center gap-4 w-full max-w-lg">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-dim))' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: 'var(--color-gold-dim)' }} />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, var(--color-gold-dim))' }} />
        </div>
      </motion.div>
    </section>
  )
}

