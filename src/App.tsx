import { useEffect } from 'react'
import Hero from './components/Hero'
import Tools from './components/Tools'
import MagicalBook from './components/MagicalBook'
import Footer from './components/Footer'

function DustParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${2 + Math.random() * 3}px`,
    duration: `${8 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    opacity: 0.3 + Math.random() * 0.5,
  }))

  return (
    <div className="dust-container">
      {particles.map((p) => (
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
  )
}

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.section-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <DustParticles />
      <main className="relative z-10">
        <Hero />
        <Tools />
        <MagicalBook />
        <Footer />
      </main>
    </>
  )
}
