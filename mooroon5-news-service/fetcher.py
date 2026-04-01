import os
from datetime import date, timedelta
from typing import Any
from tavily import TavilyClient
from newspaper import Article


def fetch_news(company_name: str) -> list[dict[str, str]]:
    """Search for recent news about a company and fetch full article content.

    Returns a list of dicts with keys: title, url, content, source, published_date.
    Falls back to Tavily snippet if newspaper4k fails to fetch the full article.
    Returns empty list if Tavily returns no results.
    Only returns articles published within the last 7 days.
    """
    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    today = date.today()
    week_start = today - timedelta(days=7)
    query = f"{company_name} news {today.strftime('%B %Y')}"

    response: dict[str, Any] = client.search(
        query=query,
        max_results=10,
        search_depth="advanced",
        days=7,  # Tavily hard filter: only articles from the last 7 days
    )

    # Log the date range for debugging
    print(f"📅 Fetching news for '{company_name}' from {week_start} to {today}")

    results: list[dict[str, Any]] = response.get("results", [])

    if not results:
        print(f"⚠️  Tavily returned 0 results for '{company_name}' — skipping")
        return []

    articles: list[dict[str, str]] = []
    skipped = 0

    for item in results:
        title: str = item.get("title", "")
        url: str = item.get("url", "")
        snippet: str = item.get("content", "")
        source: str = _extract_source(url)
        published_date: str = item.get("published_date", "")

        # Secondary filter: skip articles older than 7 days if date is available
        if published_date and not _is_recent(published_date, week_start):
            print(f"⏭️  Skipping old article ({published_date}): {title[:60]}")
            skipped += 1
            continue

        content = _fetch_full_content(url, fallback=snippet)

        articles.append({
            "title": title,
            "url": url,
            "content": content,
            "source": source,
            "published_date": published_date,
        })

    print(f"✅ Got {len(articles)} recent articles for '{company_name}' ({skipped} old skipped)")
    return articles


def _fetch_full_content(url: str, fallback: str) -> str:
    """Attempt to fetch the full article text via newspaper4k.

    Falls back to the provided Tavily snippet on any failure.
    """
    try:
        article = Article(url)
        article.download()
        article.parse()
        text = article.text.strip()
        return text if text else fallback
    except Exception:
        return fallback


def _is_recent(published_date: str, cutoff: date) -> bool:
    """Return True if the published_date string is on or after the cutoff date."""
    from datetime import datetime
    for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            parsed = datetime.strptime(published_date[:len(fmt)], fmt).date()
            return parsed >= cutoff
        except ValueError:
            continue
    return True  # if unparseable, keep the article


def _extract_source(url: str) -> str:
    """Extract a readable source name from a URL."""
    try:
        from urllib.parse import urlparse
        hostname = urlparse(url).hostname or url
        # Strip www. prefix
        return hostname.removeprefix("www.")
    except Exception:
        return url
