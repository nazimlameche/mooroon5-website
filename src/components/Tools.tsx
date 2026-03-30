const tools = [
  {
    icon: '📜',
    name: 'Ancient Scripts',
    description: 'Deciphering the arcane languages of code and logic.',
  },
  {
    icon: '🔮',
    name: 'The Oracle',
    description: 'Divining solutions through data and analysis.',
  },
  {
    icon: '⚗️',
    name: 'Alchemist\'s Brew',
    description: 'Transmuting raw ideas into golden implementations.',
  },
  {
    icon: '🗝️',
    name: 'Skeleton Key',
    description: 'Unlocking the deepest mysteries of systems.',
  },
  {
    icon: '📐',
    name: 'The Compass',
    description: 'Navigating the architecture of complex designs.',
  },
  {
    icon: '🕯️',
    name: 'Luminos',
    description: 'Illuminating the darkest corners of debugging.',
  },
]

export default function Tools() {
  return (
    <section
      className="section-reveal relative py-24 md:py-32 px-6"
      style={{
        background: `
          linear-gradient(to bottom, var(--color-bg-deep), var(--color-bg-dark) 20%, var(--color-bg-dark) 80%, var(--color-bg-deep))
        `,
      }}
    >
      {/* Section header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            textShadow: '0 0 30px rgba(201,168,76,0.2)',
          }}
        >
          Our Grimoire of Tools
        </h2>
        <div className="golden-divider" />
        <p
          className="mt-4 text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--color-parchment-dim)', fontFamily: 'var(--font-body)' }}
        >
          Each instrument in our collection has been carefully curated for the craft
        </p>
      </div>

      {/* Tool cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </div>
    </section>
  )
}

function ToolCard({ icon, name, description }: { icon: string; name: string; description: string }) {
  return (
    <div
      className="group relative rounded-lg p-6 cursor-default transition-all duration-500"
      style={{
        background: `
          linear-gradient(145deg, var(--color-bg-card) 0%, rgba(30,24,18,0.8) 100%)
        `,
        border: '1px solid rgba(201,168,76,0.12)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(201,168,76,0.35)'
        el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.1)'
        el.style.transform = 'translateY(-4px)'
        el.style.background = 'linear-gradient(145deg, var(--color-bg-card-hover) 0%, var(--color-bg-card) 100%)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.border = '1px solid rgba(201,168,76,0.12)'
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
        el.style.transform = 'translateY(0)'
        el.style.background = 'linear-gradient(145deg, var(--color-bg-card) 0%, rgba(30,24,18,0.8) 100%)'
      }}
    >
      {/* Corner ornaments */}
      <div
        className="absolute top-2 left-2 w-4 h-4 opacity-20"
        style={{
          borderTop: '1px solid var(--color-gold)',
          borderLeft: '1px solid var(--color-gold)',
        }}
      />
      <div
        className="absolute bottom-2 right-2 w-4 h-4 opacity-20"
        style={{
          borderBottom: '1px solid var(--color-gold)',
          borderRight: '1px solid var(--color-gold)',
        }}
      />

      {/* Icon */}
      <div
        className="text-4xl mb-4 candle-flicker"
        style={{ filter: 'saturate(0.8)' }}
      >
        {icon}
      </div>

      {/* Name */}
      <h3
        className="text-xl font-semibold mb-2 tracking-wide"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-parchment)',
        }}
      >
        {name}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-parchment-dim)',
        }}
      >
        {description}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 transition-all duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
        }}
        ref={(el) => {
          if (!el) return
          const parent = el.parentElement!
          parent.addEventListener('mouseenter', () => { el.style.width = '80%' })
          parent.addEventListener('mouseleave', () => { el.style.width = '0%' })
        }}
      />
    </div>
  )
}
