# Claude Code Prompt — Mooroon5 News Service

Build a simple Python script for automated weekly company news newsletters.
No framework, no microservice, no server — just a clean script that runs via GitHub Actions every Monday.

---

## Project Structure

Create exactly this structure:

```
mooroon5-news-service/
├── main.py                     # Single entry point — runs the full job
├── fetcher.py                  # Tavily search + newspaper4k article fetch
├── summarizer.py               # Claude Haiku API — summarize articles
├── email_sender.py             # Resend — send newsletter
├── subscriptions.json          # List of active subscriptions
├── .env.example                # Environment variables template
├── requirements.txt            # Python dependencies
├── .gitignore                  # Must include .env and .env.local
├── .github/
│   └── workflows/
│       └── newsletter.yml      # GitHub Actions cron — every Monday 8am Paris
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| News search | Tavily API (`tavily-python`) |
| Article content | `newspaper4k` |
| AI summarization | Anthropic API — `claude-haiku-4-5` only |
| Email sending | Resend (`resend` Python SDK) |
| Scheduler | GitHub Actions cron |
| Subscriptions | `subscriptions.json` flat file |
| Config | `python-dotenv` |

---

## subscriptions.json structure

```json
[
  {
    "id": "1",
    "email": "nazim@example.com",
    "company_name": "Apple",
    "is_active": true
  },
  {
    "id": "2",
    "email": "basile@example.com",
    "company_name": "Tesla",
    "is_active": true
  }
]
```

Only `is_active: true` subscriptions are processed. This file is committed to the repo — it is the database for now.

---

## Complete Flow (implement exactly this)

```
GitHub Actions trigger (every Monday 8am Paris)
    ↓
main.py runs
    ↓
Load subscriptions from subscriptions.json
Filter only is_active: true
    ↓
For each subscription:
    ↓
    fetcher.py — Tavily search: "{company_name} news this week"
    → returns 5-8 articles with title + URL + snippet
    ↓
    fetcher.py — newspaper4k: fetch full content for each URL
    → fallback to Tavily snippet if fetch fails
    ↓
    summarizer.py — Claude Haiku API:
        "You are a professional financial and business analyst.
         Summarize the following news articles about {company_name}.
         For each article provide:
         - Title
         - 3-line summary
         - One key insight
         - Source URL
         End with a 5-line global summary of the company's week.
         Be factual, concise, and professional."
    ↓
    email_sender.py — Resend: send HTML email to subscriber
    ↓
    Log: "✅ Sent to {email} for {company_name}"
```

---

## main.py structure

```python
def run():
    subscriptions = load_subscriptions()       # read subscriptions.json
    active = [s for s in subscriptions if s["is_active"]]

    for sub in active:
        try:
            articles = fetch_news(sub["company_name"])
            summary = summarize(sub["company_name"], articles)
            send_email(sub["email"], sub["company_name"], summary)
            print(f"✅ Sent to {sub['email']} for {sub['company_name']}")
        except Exception as e:
            print(f"❌ Failed for {sub['company_name']}: {e}")
            continue  # never crash the whole job

if __name__ == "__main__":
    run()
```

---

## Email Template (inline CSS only)

Style the HTML email with this exact structure:

```
Subject: 📰 Weekly Brief — {company_name} | Week of {date}

─────────────────────────────────────────
HEADER
  "Mooroon5 News Intelligence"
  Company name in large font
  Week date range

─────────────────────────────────────────
GLOBAL SUMMARY BLOCK
  "This Week in {company_name}"
  5-line AI-generated overview paragraph

─────────────────────────────────────────
ARTICLE BLOCKS (repeat for each article)
  Article number + source name
  Article title (bold)
  3-line summary
  💡 Key insight (highlighted)
  🔗 Read full article → [URL as clickable link]

─────────────────────────────────────────
FOOTER
  "Mooroon5 News Service"
  "Powered by the greatest minds"
```

Use inline CSS only — no external stylesheets.
Color scheme: dark background #1a1008, gold accents #c9a84c, parchment text #f5e6c8.

---

## GitHub Actions workflow (.github/workflows/newsletter.yml)

```yaml
name: Weekly Newsletter

on:
  schedule:
    - cron: '0 7 * * 1'  # Every Monday at 8am Paris (UTC+1)
  workflow_dispatch:       # Allow manual trigger from GitHub UI for testing

jobs:
  send-newsletter:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run newsletter
        env:
          TAVILY_API_KEY: ${{ secrets.TAVILY_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          FROM_EMAIL: ${{ secrets.FROM_EMAIL }}
        run: python main.py
```

The `workflow_dispatch` trigger allows manual runs from GitHub Actions UI — use this to test without waiting for Monday.

---

## .env.example

```env
TAVILY_API_KEY=your_tavily_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
RESEND_API_KEY=your_resend_key_here
FROM_EMAIL=newsletter@mooroon5.dev
```

---

## requirements.txt

```
tavily-python
newspaper4k
anthropic
resend
python-dotenv
```

---

## Error Handling Rules

- If Tavily returns 0 results → log warning, skip that subscription, continue to next
- If newspaper4k fails to fetch an article → use the Tavily snippet as fallback, never crash
- If Claude API fails → retry once after 5 seconds, then skip and log error
- If Resend fails → log error, continue to next subscription, never crash the whole job
- Wrap each subscription in try/except — one failure must never block the others

---

## .gitignore (must include)

```
.env
.env.local
__pycache__/
*.pyc
.venv/
venv/
```

---

## Constraints

- Single responsibility per file — one file = one job
- Type hints on every function
- No hardcoded values — everything from `.env`
- No framework, no FastAPI, no server — pure Python script only
- `subscriptions.json` is the only "database" for now
- `claude-haiku-4-5` is the only allowed model — do not use any other