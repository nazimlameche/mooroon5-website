# Mooroon5 News Service

Automated weekly company news newsletter. Runs every Monday via GitHub Actions.

## How it works

1. Loads active subscriptions from `subscriptions.json`
2. Searches recent news for each company via Tavily
3. Fetches full article content via newspaper4k (falls back to snippets)
4. Summarizes with Gemini Flash (gemini-1.5-flash)
5. Sends a styled HTML email via Resend

## Setup

### 1. Copy and fill in environment variables

```bash
cp .env.example .env
```

Edit `.env` with your real keys:

| Variable | Where to get it |
|---|---|
| `TAVILY_API_KEY` | [app.tavily.com](https://app.tavily.com) |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) |
| `FROM_EMAIL` | A verified sender address in your Resend account |

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run locally

```bash
python main.py
```

## Managing subscriptions

Edit `subscriptions.json` to add, remove, or pause subscriptions:

```json
[
  {
    "id": "1",
    "email": "user@example.com",
    "company_name": "Apple",
    "is_active": true
  }
]
```

Set `"is_active": false` to pause a subscription without deleting it.

## GitHub Actions

Add these secrets in your repository settings (`Settings > Secrets > Actions`):

- `TAVILY_API_KEY`
- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`

The workflow runs automatically every Monday at 8am Paris time.
To trigger a manual run: go to `Actions > Weekly Newsletter > Run workflow`.
