import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL

  if (!apiKey) throw new Error('RESEND_API_KEY environment variable is not set')
  if (!fromEmail) throw new Error('FROM_EMAIL environment variable is not set')

  const { email, company } = req.body as { email?: string; company?: string }

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'Email is required' })
  }
  if (!company || company.trim() === '') {
    return res.status(400).json({ error: 'Company is required' })
  }

  const resend = new Resend(apiKey)

  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;letter-spacing:0.05em;">New Subscription Request</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #3d2b1a;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8995a;">Email</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#f5e6c8;">${email.trim()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #3d2b1a;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8995a;">Company</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#f5e6c8;">${company.trim()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8995a;">Date</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#f5e6c8;">${date}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Note -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:#1a1008;border:1px solid #4a3520;border-radius:6px;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#b8995a;font-style:italic;">
                  Add this subscription to <code style="background:#3d2b1a;color:#c9a84c;padding:1px 6px;border-radius:3px;font-style:normal;">subscriptions.json</code> and push to activate.
                </p>
              </div>
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

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: 'newsletter@mooroon5.fr',
    subject: `🧙 New Newsletter Subscription — ${company.trim()}`,
    html,
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
