import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Newspaper, Library } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import NewsToolDialog from './NewsToolDialog'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Tools() {
  const reducedMotion = useReducedMotion()
  const [dialogOpen, setDialogOpen] = useState(false)

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
            style={{ color: 'var(--color-gold)', filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.4))' }}
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

      {/* Single tool card — centered */}
      <div className="max-w-5xl mx-auto flex justify-center">
        <motion.div
          className="w-full max-w-xs group relative rounded-xl cursor-pointer"
          variants={reducedMotion ? undefined : cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          whileHover={
            reducedMotion ? undefined : {
              y: -6,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }
          }
          onClick={() => setDialogOpen(true)}
        >
          <Card
            className={cn(
              'relative h-full rounded-xl overflow-hidden',
              'bg-gradient-to-br from-[var(--color-bg-card)] to-[rgba(30,24,18,0.8)]',
              'ring-1 ring-[rgba(201,168,76,0.35)] shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_20px_rgba(201,168,76,0.08)]',
              'group-hover:ring-[rgba(201,168,76,0.6)] group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_40px_rgba(201,168,76,0.18)]',
              'transition-[box-shadow,ring-color] duration-300',
            )}
          >
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--color-gold)] opacity-40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--color-gold)] opacity-40" />

            <CardContent className="flex flex-col items-center text-center p-6">
              {/* Icon */}
              <div
                className="mb-4 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 bg-[rgba(201,168,76,0.1)] group-hover:bg-[rgba(201,168,76,0.18)]"
                style={{ border: '1px solid rgba(201,168,76,0.25)' }}
              >
                <Newspaper
                  className="w-7 h-7"
                  style={{
                    color: 'var(--color-gold)',
                    filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.4))',
                  }}
                />
              </div>

              {/* Name */}
              <h3
                className="text-lg font-semibold mb-2 tracking-wide"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-parchment)',
                }}
              >
                News Intelligence
              </h3>

              {/* Description */}
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-parchment-dim)' }}
              >
                Weekly AI-curated news briefings delivered straight to your inbox
              </p>

              {/* Badge */}
              <Badge
                className={cn(
                  'h-auto rounded-full px-3 py-1',
                  'text-xs tracking-[0.15em] uppercase',
                  'bg-[rgba(201,168,76,0.12)] border-[rgba(201,168,76,0.35)]',
                  'text-[var(--color-gold)]',
                )}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Try it
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <NewsToolDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  )
}
