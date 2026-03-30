import logoUrl from '../assets/logo.svg'

const members = ['Nazim', 'Basile', 'Maia', 'Gabriel', 'Tieoule', 'Thomas']

export default function Hero() {
  return (
    <section
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

      <div className="relative z-10 flex flex-col items-center ink-reveal">
        {/* Logo */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-20"
            style={{ background: 'var(--color-gold)' }}
          />
          <img
            src={logoUrl}
            alt="Mooroon5 Logo"
            className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl candle-flicker"
          />
        </div>

        {/* Team Name */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            textShadow: '0 0 40px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          Mooroon5
        </h1>

        <div className="golden-divider" />

        {/* Members */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 mb-10">
          {members.map((name, i) => (
            <span
              key={name}
              className="text-lg md:text-xl tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-parchment-dark)',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Citation */}
        <div className="relative mt-4 mb-8">
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
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
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
      </div>
    </section>
  )
}
