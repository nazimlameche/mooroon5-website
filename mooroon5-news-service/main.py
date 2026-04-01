from dotenv import load_dotenv

from db import get_active_subscriptions, update_last_sent
from fetcher import fetch_news
from summarizer import summarize
from email_sender import send_email

load_dotenv()


def run() -> None:
    subscriptions = get_active_subscriptions()

    print(f"📬 Processing {len(subscriptions)} active subscription(s)...")

    for sub in subscriptions:
        company: str = sub["company_name"]
        email: str = sub["email"]

        try:
            articles = fetch_news(company)
            if not articles:
                print(f"⚠️  No articles found for {company} — skipping")
                continue

            summary = summarize(company, articles)
            send_email(email, company, summary)
            update_last_sent(email, company)
            print(f"✅ Sent to {email} for {company}")

        except Exception as e:
            print(f"❌ Failed for {company}: {e}")
            continue  # never crash the whole job


if __name__ == "__main__":
    run()
