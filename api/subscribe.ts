import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import postgres from 'postgres'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const dbUrl = process.env.NEON_DATABASE_URL
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL

  if (!dbUrl) throw new Error('NEON_DATABASE_URL environment variable is not set')
  if (!apiKey) throw new Error('RESEND_API_KEY environment variable is not set')
  if (!fromEmail) throw new Error('FROM_EMAIL environment variable is not set')

  const { email, company } = req.body as { email?: string; company?: string }

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!company || company.trim() === '') {
    return res.status(400).json({ error: 'Company is required' })
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanCompany = company.trim()

  const sql = postgres(dbUrl, { ssl: 'require' })

  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        last_sent_at TIMESTAMP
      )
    `

    // Check for existing subscription
    const existing = await sql`
      SELECT id FROM subscriptions
      WHERE email = ${cleanEmail}
        AND company_name = ${cleanCompany}
      LIMIT 1
    `

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already subscribed' })
    }

    // Insert new subscription
    await sql`
      INSERT INTO subscriptions (email, company_name)
      VALUES (${cleanEmail}, ${cleanCompany})
    `

    // Send confirmation email to subscriber
    const resend = new Resend(apiKey)

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#1a1008;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1008;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#231509;border:1px solid #4a3520;border-radius:8px;overflow:hidden;">
          <!-- Top gold border -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #4a3520;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8995a;">Mooroon5 · News Intelligence</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;letter-spacing:0.05em;">Subscription Confirmed</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:#f5e6c8;line-height:1.7;">
                You will receive weekly news about <strong style="color:#c9a84c;">${cleanCompany}</strong> every Monday morning.
              </p>
              <div style="background:#1a1008;border:1px solid #4a3520;border-radius:6px;padding:16px 20px;">
                <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8995a;">Subscribed for</p>
                <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#c9a84c;">${cleanCompany}</p>
              </div>
              <p style="margin:24px 0 0;font-size:13px;color:#b8995a;font-style:italic;line-height:1.6;">
                To unsubscribe, reply to this email with "Unsubscribe" in the subject.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 28px;">
              <p style="margin:0;font-size:12px;color:#4a3520;">— The Mooroon5 Team</p>
            </td>
          </tr>
          <!-- Bottom gold border -->
          <tr>
            <td style="height:1px;background:linear-gradient(90deg,transparent,#4a3520,transparent);"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: cleanEmail,
      subject: `✨ Subscription confirmed — ${cleanCompany}`,
      html,
    })

    if (emailError) {
      // Subscription saved — don't fail the request over email
      console.error('Confirmation email failed:', emailError.message)
    }

    return res.status(200).json({ success: true })
  } finally {
    await sql.end()
  }
}
