import logoUrl from '../assets/logo.svg'

export default function Footer() {
  return (
    <footer
      className="relative py-16 px-6"
      style={{
        background: `
          linear-gradient(to bottom, var(--color-bg-deep), #060504)
        `,
      }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-gold-dim), transparent)',
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <img
          src={logoUrl}
          alt="Mooroon5"
          className="w-16 h-16 object-contain opacity-70"
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
      </div>
    </footer>
  )
}
