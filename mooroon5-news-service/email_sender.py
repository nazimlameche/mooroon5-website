import os
import re
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
    summary_html = _summary_to_html(summary, company_name)

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

          <!-- CONTENT -->
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


# ─── Parser ──────────────────────────────────────────────────────────────────

def _summary_to_html(summary: str, company_name: str) -> str:
    """Parse the structured Gemini output and render it as HTML."""
    cleaned = _strip_markdown(summary)
    lines = [line.rstrip() for line in cleaned.split("\n")]

    themes: list[dict] = []
    global_lines: list[str] = []
    current_theme: dict | None = None
    current_article: dict | None = None
    in_global = False

    for line in lines:
        stripped = line.strip()

        # ── Global summary block ──────────────────────────────────────────
        if stripped.upper().startswith("GLOBAL:"):
            in_global = True
            _flush_article(current_article, current_theme)
            current_article = None
            _flush_theme(current_theme, themes)
            current_theme = None
            rest = stripped[7:].strip()
            if rest:
                global_lines.append(rest)
            continue

        if in_global:
            if stripped:
                global_lines.append(stripped)
            continue

        # ── Theme header ──────────────────────────────────────────────────
        if stripped.upper().startswith("THEME:"):
            _flush_article(current_article, current_theme)
            current_article = None
            _flush_theme(current_theme, themes)

            theme_part = stripped[6:].strip()
            wow = 5
            theme_name = theme_part
            if "| WOW:" in theme_part.upper():
                idx = theme_part.upper().index("| WOW:")
                theme_name = theme_part[:idx].strip()
                try:
                    wow = int(re.search(r"\d+", theme_part[idx + 6:]).group())
                except (AttributeError, ValueError):
                    wow = 5

            current_theme = {"name": theme_name, "wow": max(1, min(10, wow)), "articles": []}
            continue

        # ── Article fields ────────────────────────────────────────────────
        if stripped.upper().startswith("TITLE:"):
            _flush_article(current_article, current_theme)
            current_article = {"title": stripped[6:].strip(), "url": "", "summary": "", "insight": ""}
            continue

        if stripped.upper().startswith("URL:") and current_article is not None:
            current_article["url"] = stripped[4:].strip()
            continue

        if stripped.upper().startswith("SUMMARY:") and current_article is not None:
            current_article["summary"] = stripped[8:].strip()
            continue

        if stripped.upper().startswith("INSIGHT:") and current_article is not None:
            current_article["insight"] = stripped[8:].strip()
            continue

    # Flush remaining
    _flush_article(current_article, current_theme)
    _flush_theme(current_theme, themes)

    # ── Build HTML ────────────────────────────────────────────────────────
    parts: list[str] = []

    # Global summary first — most prominent block
    if global_lines:
        global_text = " ".join(global_lines)
        parts.append(
            f'<div style="margin-bottom:32px;padding:20px 24px;background-color:#1a1208;'
            f'border-left:3px solid #c9a84c;border-radius:4px;">'
            f'<p style="margin:0 0 10px 0;font-size:11px;letter-spacing:3px;'
            f'text-transform:uppercase;color:#c9a84c;">This Week in {company_name}</p>'
            f'<p style="margin:0;font-size:14px;line-height:1.8;color:#c4b8a4;">{global_text}</p>'
            f'</div>'
        )

    # Theme blocks
    for theme in themes:
        wow_html = _wow_meter_html(theme["wow"])
        parts.append(
            f'<div style="margin-bottom:32px;">'
            f'<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;'
            f'border-bottom:1px solid #2a1e0e;padding-bottom:10px;">'
            f'<tr>'
            f'<td style="font-size:15px;letter-spacing:1px;color:#c9a84c;font-weight:bold;">'
            f'{theme["name"]}</td>'
            f'<td align="right">{wow_html}</td>'
            f'</tr>'
            f'</table>'
        )

        for article in theme["articles"]:
            url_part = (
                f'<a href="{article["url"]}" style="font-size:12px;color:#c9a84c;'
                f'text-decoration:none;">&#128279; Read full article &rarr;</a>'
                if article["url"] else ""
            )
            insight_part = (
                f'<p style="margin:0 0 10px 0;font-size:13px;padding:8px 12px;'
                f'background-color:#1a1208;border-left:2px solid #c9a84c;color:#f5e6c8;">'
                f'&#128161; {article["insight"]}</p>'
                if article["insight"] else ""
            )

            parts.append(
                f'<div style="margin-bottom:18px;padding:16px;background-color:#0f0b06;'
                f'border-radius:6px;border:1px solid #2a1e0e;">'
                f'<p style="margin:0 0 8px 0;font-size:15px;font-weight:bold;color:#e8dcc8;">'
                f'{article["title"]}</p>'
                f'<p style="margin:0 0 10px 0;font-size:13px;line-height:1.7;color:#9a8e7a;">'
                f'{article["summary"]}</p>'
                f'{insight_part}'
                f'{url_part}'
                f'</div>'
            )

        parts.append('</div>')

    # Fallback: if parsing produced nothing, show the raw text safely escaped
    if not parts:
        escaped = cleaned.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        parts.append(
            f'<pre style="font-size:13px;color:#c4b8a4;white-space:pre-wrap;">{escaped}</pre>'
        )

    return "\n".join(parts)


def _flush_article(article: dict | None, theme: dict | None) -> None:
    if article is not None and theme is not None:
        theme["articles"].append(article)


def _flush_theme(theme: dict | None, themes: list) -> None:
    if theme is not None:
        themes.append(theme)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _wow_meter_html(score: int) -> str:
    """Render the wow meter as colored circles with a numeric score."""
    score = max(1, min(10, score))
    if score >= 8:
        color = "#c9a84c"
    elif score >= 5:
        color = "#7a6528"
    else:
        color = "#3a2e1a"

    filled = "&#9679;" * score        # ●
    empty = "&#9675;" * (10 - score)  # ○

    return (
        f'<span style="font-size:13px;white-space:nowrap;">'
        f'<span style="color:{color};">{filled}</span>'
        f'<span style="color:#2a2010;">{empty}</span>'
        f'<span style="color:#9a8e7a;margin-left:6px;font-size:11px;">{score}/10</span>'
        f'</span>'
    )


def _strip_markdown(text: str) -> str:
    """Remove markdown syntax that the model might output despite instructions."""
    # Bold and italic
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\*(.+?)\*', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'__(.+?)__', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'_(.+?)_', r'\1', text, flags=re.DOTALL)
    # ATX headers (## Title)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Bullet points and numbered lists at line start
    text = re.sub(r'^\s*[\-\*\+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    # Horizontal rules
    text = re.sub(r'^[-\*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    # Inline code
    text = re.sub(r'`(.+?)`', r'\1', text)
    return text
