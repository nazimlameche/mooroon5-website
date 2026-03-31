import os
from datetime import date, timedelta
import resend


def send_email(to: str, company_name: str, summary: str) -> None:
    """Build and send the weekly newsletter HTML email via Resend."""
    resend.api_key = os.environ["RESEND_API_KEY"]
    from_email: str = os.environ["FROM_EMAIL"]

    week_range = _week_range()
    subject = f"📰 Weekly Brief — {company_name} | Week of {week_range}"
    html = _build_html(company_name, summary, week_range)

    resend.Emails.send({
        "from": f"Mooroon5 News <{from_email}>",
        "to": [to],
        "subject": subject,
        "html": html,
    })


def _week_range() -> str:
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    return f"{monday.strftime('%b %d')} – {sunday.strftime('%b %d, %Y')}"


def _build_html(company_name: str, summary: str, week_range: str) -> str:
    summary_html = _summary_to_html(summary)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mooroon5 News — {company_name}</title>
</head>
<body style="margin:0;padding:0;background-color:#1a1008;font-family:Georgia,serif;color:#f5e6c8;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1008;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#0f0804;border:1px solid #c9a84c;border-radius:8px 8px 0 0;padding:32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">
                Mooroon5 News Intelligence
              </p>
              <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:bold;color:#c9a84c;letter-spacing:2px;">
                {company_name}
              </h1>
              <p style="margin:0;font-size:13px;color:#9a8e7a;letter-spacing:1px;">
                Week of {week_range}
              </p>
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></td>
          </tr>

          <!-- SUMMARY CONTENT -->
          <tr>
            <td style="background-color:#130d06;border-left:1px solid #c9a84c;border-right:1px solid #c9a84c;padding:32px;">
              {summary_html}
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#0f0804;border:1px solid #c9a84c;border-top:none;border-radius:0 0 8px 8px;padding:24px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;">
                Mooroon5 News Service
              </p>
              <p style="margin:0;font-size:11px;color:#6a5e4a;font-style:italic;">
                Powered by the greatest minds
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""


def _summary_to_html(summary: str) -> str:
    """Convert the plain-text AI summary into styled HTML blocks."""
    lines = summary.split("\n")
    html_parts: list[str] = []
    in_global = False

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Detect global summary section
        if "this week in" in stripped.lower() or "global summary" in stripped.lower():
            in_global = True
            html_parts.append(
                f'<h2 style="margin:32px 0 12px 0;font-size:18px;color:#c9a84c;'
                f'letter-spacing:1px;border-bottom:1px solid #3a2a14;padding-bottom:8px;">'
                f'{stripped}</h2>'
            )
            continue

        # Detect article headers (Article N:)
        if stripped.lower().startswith("article ") and ":" in stripped:
            in_global = False
            html_parts.append(
                f'<h3 style="margin:28px 0 8px 0;font-size:14px;color:#c9a84c;'
                f'letter-spacing:2px;text-transform:uppercase;">{stripped}</h3>'
            )
            continue

        # Key insight lines
        if stripped.startswith("💡") or stripped.lower().startswith("key insight"):
            html_parts.append(
                f'<p style="margin:10px 0;padding:10px 14px;background-color:#1e1408;'
                f'border-left:3px solid #c9a84c;font-size:14px;color:#f5e6c8;">{stripped}</p>'
            )
            continue

        # Source URL lines
        if stripped.startswith("🔗") or stripped.lower().startswith("source url") or stripped.lower().startswith("url:"):
            # Try to extract a hyperlink
            url = _extract_url(stripped)
            if url:
                html_parts.append(
                    f'<p style="margin:8px 0;font-size:13px;">'
                    f'<a href="{url}" style="color:#c9a84c;text-decoration:none;">🔗 Read full article →</a>'
                    f'</p>'
                )
            else:
                html_parts.append(
                    f'<p style="margin:8px 0;font-size:13px;color:#9a8e7a;">{stripped}</p>'
                )
            continue

        # Bold titles (lines starting with - Title or **Title**)
        if stripped.startswith("- Title") or stripped.startswith("**"):
            clean = stripped.lstrip("- ").strip("*")
            html_parts.append(
                f'<p style="margin:10px 0 4px 0;font-size:15px;font-weight:bold;color:#e8dcc8;">{clean}</p>'
            )
            continue

        # Global summary paragraph lines
        if in_global:
            html_parts.append(
                f'<p style="margin:6px 0;font-size:14px;line-height:1.7;color:#c4b8a4;">{stripped}</p>'
            )
            continue

        # Default body line
        html_parts.append(
            f'<p style="margin:6px 0;font-size:14px;line-height:1.6;color:#c4b8a4;">{stripped}</p>'
        )

    return "\n".join(html_parts)


def _extract_url(text: str) -> str:
    """Extract the first http/https URL from a string."""
    import re
    match = re.search(r'https?://\S+', text)
    return match.group(0).rstrip(".,)") if match else ""
