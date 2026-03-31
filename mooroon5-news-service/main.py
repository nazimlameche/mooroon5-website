import json
import os
from pathlib import Path

from dotenv import load_dotenv

from fetcher import fetch_news
from summarizer import summarize
from email_sender import send_email

load_dotenv()

SUBSCRIPTIONS_FILE = Path(__file__).parent / "subscriptions.json"


def load_subscriptions() -> list[dict]:
    """Load all subscriptions from subscriptions.json."""
    with open(SUBSCRIPTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def run() -> None:
    subscriptions = load_subscriptions()
    active = [s for s in subscriptions if s["is_active"]]

    print(f"📬 Processing {len(active)} active subscription(s)...")

    for sub in active:
        company: str = sub["company_name"]
        email: str = sub["email"]

        try:
            articles = fetch_news(company)
            if not articles:
                print(f"⚠️  No articles found for {company} — skipping")
                continue

            summary = summarize(company, articles)
            send_email(email, company, summary)
            print(f"✅ Sent to {email} for {company}")

        except Exception as e:
            print(f"❌ Failed for {company}: {e}")
            continue  # never crash the whole job


if __name__ == "__main__":
    run()
