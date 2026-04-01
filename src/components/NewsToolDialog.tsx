import { useState } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Send, CheckCircle, XCircle, Loader } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const API_URL = 'http://localhost:8000'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface NewsToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NewsToolDialog({ open, onOpenChange }: NewsToolDialogProps) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company_name: company }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail ?? 'Unknown error')
      }

      setStatus('success')
      setMessage(data.message)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to connect to the news service.')
    }
  }

  function handleClose(open: boolean) {
    if (!open) {
      setStatus('idle')
      setMessage('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md border-0 p-0 overflow-hidden"
        style={{ background: 'var(--color-bg-card)' }}
      >
        {/* Gold top border */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
        />

        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <Newspaper
                  className="w-5 h-5"
                  style={{ color: 'var(--color-gold)' }}
                />
              </div>
              <DialogTitle
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
              >
                News Intelligence
              </DialogTitle>
            </div>
            <DialogDescription
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-parchment-dim)' }}
            >
              Enter a company name and email. We'll search this week's news, summarize
              it with AI, and send a curated briefing straight to your inbox.
            </DialogDescription>
          </DialogHeader>

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Company input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="company"
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-parchment-dim)' }}
                >
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Apple, Tesla, LVMH…"
                  required
                  disabled={status === 'loading'}
                  className="rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: 'var(--color-parchment)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)' }}
                />
              </div>

              {/* Email input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-parchment-dim)' }}
                >
                  Send to
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={status === 'loading'}
                  className="rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: 'var(--color-parchment)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)' }}
                />
              </div>

              {/* Error message */}
              {status === 'error' && (
                <motion.div
                  className="flex items-start gap-2 rounded-md px-4 py-3 text-sm"
                  style={{
                    background: 'rgba(107,29,42,0.2)',
                    border: '1px solid rgba(107,29,42,0.4)',
                    color: '#e08080',
                    fontFamily: 'var(--font-body)',
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{message}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={status === 'loading'}
                className={cn(
                  'mt-2 w-full py-2.5 text-sm tracking-[0.1em] uppercase transition-all duration-200',
                  'disabled:opacity-60',
                )}
                style={{
                  fontFamily: 'var(--font-display)',
                  background: status === 'loading'
                    ? 'rgba(201,168,76,0.15)'
                    : 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.08) 100%)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: 'var(--color-gold)',
                }}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Dispatching…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Briefing
                  </span>
                )}
              </Button>
            </form>
          ) : (
            /* Success state */
            <motion.div
              className="flex flex-col items-center gap-4 py-4 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle
                className="w-12 h-12"
                style={{ color: 'var(--color-gold)' }}
              />
              <p
                className="text-base"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-parchment)' }}
              >
                {message}
              </p>
              <Button
                onClick={() => handleClose(false)}
                variant="ghost"
                className="text-xs uppercase tracking-[0.15em] mt-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-parchment-dim)',
                }}
              >
                Close
              </Button>
            </motion.div>
          )}
        </div>

        {/* Gold bottom border */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-dim), transparent)' }}
        />
      </DialogContent>
    </Dialog>
  )
}
