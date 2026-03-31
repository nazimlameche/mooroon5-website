import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Crown, Scroll, Star } from 'lucide-react'
import Hero from './components/Hero'
import Tools from './components/Tools'
import MagicalBook from './components/MagicalBook'
import Footer from './components/Footer'
import CrestDivider from './components/CrestDivider'
import Navbar from './components/Navbar'

/* ─── Ember variants — defined outside component per CLAUDE.md ─── */
const emberVariants = {
  dormant: { opacity: 0, scale: 0.2, y: 0 },
  flare: {
    opacity: [0, 1, 1, 0.7, 0],
    scale: [0.2, 1.4, 1.1, 0.9, 0.5],
    y: [0, -8, -18, -32, -55],
  },
}

/* ─── Unified Magical Atmosphere ─── */
function MagicalAtmosphere() {
  const reducedMotion = useReducedMotion()

  const dust = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${2 + Math.random() * 3}px`,
        duration: `${8 + Math.random() * 14}s`,
        delay: `${Math.random() * 12}s`,
      })),
    [],
  )

  const embers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${15 + Math.random() * 65}%`,
        // Staggered delays so they never all flare simultaneously
        delay: i * 2.8 + Math.random() * 1.5,
        duration: 3.5 + Math.random() * 2,
      })),
    [],
  )

  if (reducedMotion) return null

  return (
    <>
      {/* Dust particles layer */}
      <div className="dust-container" style={{ zIndex: 50 }}>
        {dust.map((p) => (
          <div
            key={p.id}
            className="dust"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Magical embers layer — dramatic burst-in, slow drift upward */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 50 }}
      >
        {embers.map((e) => (
          <motion.div
            key={e.id}
            className="magic-ember absolute"
            style={{ left: e.left, top: e.top }}
            variants={emberVariants}
            initial="dormant"
            animate="flare"
            transition={{
              duration: e.duration,
              repeat: Infinity,
              delay: e.delay,
              ease: [0.2, 0, 0.8, 1],
              times: [0, 0.18, 0.35, 0.65, 1],
            }}
          />
        ))}
      </div>

      {/* Ambient magical waves — behind content */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: '10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: '50%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(107,29,42,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            bottom: '5%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(45,74,62,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <MagicalAtmosphere />
      <main className="relative w-full z-[1]">
        <Hero />
        <CrestDivider icon={Crown} />
        <Tools />
        <CrestDivider icon={Scroll} />
        <MagicalBook />
        <Footer />
      </main>
    </>
  )
}
