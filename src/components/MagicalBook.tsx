export default function MagicalBook() {
  return (
    <section
      className="section-reveal relative py-24 md:py-36 px-6 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(107, 29, 42, 0.08) 0%, transparent 60%),
          var(--color-bg-deep)
        `,
      }}
    >
      {/* Section header */}
      <div className="text-center mb-16">
        <h2
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-gold)',
            textShadow: '0 0 30px rgba(201,168,76,0.2)',
          }}
        >
          The Book
        </h2>
        <div className="golden-divider" />
      </div>

      {/* Book container */}
      <div className="flex justify-center items-center">
        <div
          className="book-wrapper relative"
          style={{ perspective: '1800px' }}
        >
          {/* Floating candle left */}
          <div className="absolute -left-16 md:-left-24 -top-10 candle-flicker opacity-80">
            <div className="relative flex flex-col items-center">
              {/* Flame */}
              <div
                className="w-3 h-5 rounded-full mb-0.5"
                style={{
                  background: 'radial-gradient(ellipse at 50% 60%, #ffd700, #ff8c00, transparent)',
                  boxShadow: '0 0 15px rgba(255,215,0,0.6), 0 0 30px rgba(255,140,0,0.3)',
                  animation: 'flameDance 2s ease-in-out infinite alternate',
                }}
              />
              {/* Wick */}
              <div className="w-px h-2" style={{ background: '#333' }} />
              {/* Candle body */}
              <div
                className="w-4 h-16 rounded-sm"
                style={{
                  background: 'linear-gradient(to right, #d4c5a0, #e8dcc8, #d4c5a0)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                }}
              />
              {/* Wax drip */}
              <div
                className="absolute bottom-4 -left-0.5 w-2 h-4 rounded-full"
                style={{ background: '#d4c5a0', opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Floating candle right */}
          <div className="absolute -right-16 md:-right-24 top-0 candle-flicker opacity-70" style={{ animationDelay: '1.5s' }}>
            <div className="relative flex flex-col items-center">
              <div
                className="w-2.5 h-4 rounded-full mb-0.5"
                style={{
                  background: 'radial-gradient(ellipse at 50% 60%, #ffd700, #ff8c00, transparent)',
                  boxShadow: '0 0 12px rgba(255,215,0,0.5), 0 0 24px rgba(255,140,0,0.2)',
                  animation: 'flameDance 2.5s ease-in-out infinite alternate',
                }}
              />
              <div className="w-px h-1.5" style={{ background: '#333' }} />
              <div
                className="w-3.5 h-14 rounded-sm"
                style={{
                  background: 'linear-gradient(to right, #c4b594, #ddd0bc, #c4b594)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>

          {/* The open book */}
          <div
            className="book group relative flex"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(5deg)',
            }}
          >
            {/* Book spine / binding */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 z-10"
              style={{
                background: 'linear-gradient(to right, #2a1f14, #3d2e1e, #2a1f14)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)',
              }}
            >
              {/* Stitching */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-px"
                  style={{
                    top: `${8 + i * 8}%`,
                    background: 'var(--color-gold-dim)',
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>

            {/* Left page */}
            <div
              className="relative w-[160px] h-[220px] sm:w-[220px] sm:h-[300px] md:w-[280px] md:h-[380px] rounded-l-sm overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, #e2d5b8 0%, #d8cab0 30%, #e8dcc8 60%, #d0c2a4 100%)
                `,
                boxShadow: 'inset -4px 0 12px rgba(0,0,0,0.15), -4px 4px 20px rgba(0,0,0,0.4)',
                transformOrigin: 'right center',
                transition: 'transform 0.6s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'rotateY(8deg)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'rotateY(0deg)'
              }}
            >
              {/* Aged paper texture lines */}
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-8 right-4"
                  style={{
                    top: `${15 + i * 5.5}%`,
                    height: '1px',
                    background: 'rgba(160,140,110,0.2)',
                  }}
                />
              ))}
              {/* Page edge shadow */}
              <div
                className="absolute top-0 right-0 w-3 h-full"
                style={{
                  background: 'linear-gradient(to left, rgba(0,0,0,0.1), transparent)',
                }}
              />
              {/* Aged corner */}
              <div
                className="absolute bottom-0 left-0 w-12 h-12"
                style={{
                  background: 'linear-gradient(135deg, rgba(180,165,140,0.3), transparent)',
                  borderRadius: '0 100% 0 0',
                }}
              />
            </div>

            {/* Right page */}
            <div
              className="relative w-[160px] h-[220px] sm:w-[220px] sm:h-[300px] md:w-[280px] md:h-[380px] rounded-r-sm overflow-hidden"
              style={{
                background: `
                  linear-gradient(225deg, #e2d5b8 0%, #ddd0bc 30%, #e8dcc8 60%, #d0c2a4 100%)
                `,
                boxShadow: 'inset 4px 0 12px rgba(0,0,0,0.15), 4px 4px 20px rgba(0,0,0,0.4)',
                transformOrigin: 'left center',
                transition: 'transform 0.6s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'rotateY(-8deg)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'rotateY(0deg)'
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-4 right-8"
                  style={{
                    top: `${15 + i * 5.5}%`,
                    height: '1px',
                    background: 'rgba(160,140,110,0.2)',
                  }}
                />
              ))}
              <div
                className="absolute top-0 left-0 w-3 h-full"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-12 h-12"
                style={{
                  background: 'linear-gradient(225deg, rgba(180,165,140,0.3), transparent)',
                  borderRadius: '100% 0 0 0',
                }}
              />
            </div>

            {/* Leather cover edges (top/bottom) */}
            <div
              className="absolute -top-2 left-0 right-0 h-3 rounded-t-sm z-0"
              style={{
                background: 'linear-gradient(to bottom, #3d2410, #5a3820)',
                boxShadow: '0 -2px 6px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="absolute -bottom-2 left-0 right-0 h-3 rounded-b-sm z-0"
              style={{
                background: 'linear-gradient(to top, #3d2410, #5a3820)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            />

            {/* Leather cover edges (left/right) */}
            <div
              className="absolute top-0 -left-2 w-3 h-full rounded-l-sm z-0"
              style={{
                background: 'linear-gradient(to right, #3d2410, #5a3820)',
                boxShadow: '-2px 0 6px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="absolute top-0 -right-2 w-3 h-full rounded-r-sm z-0"
              style={{
                background: 'linear-gradient(to left, #3d2410, #5a3820)',
                boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Glow under the book */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl"
            style={{
              background: 'rgba(201,168,76,0.15)',
            }}
          />
        </div>
      </div>

      {/* Floating particles near book */}
      <style>{`
        @keyframes flameDance {
          0% { transform: scaleY(1) scaleX(1) translateX(0); }
          33% { transform: scaleY(1.1) scaleX(0.9) translateX(-1px); }
          66% { transform: scaleY(0.95) scaleX(1.05) translateX(1px); }
          100% { transform: scaleY(1.05) scaleX(0.95) translateX(0); }
        }
      `}</style>
    </section>
  )
}
