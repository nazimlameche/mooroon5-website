import os
from typing import Any
from tavily import TavilyClient
from newspaper import Article


def fetch_news(company_name: str) -> list[dict[str, str]]:
    """Search for recent news about a company and fetch full article content.

    Returns a list of dicts with keys: title, url, content, source.
    Falls back to Tavily snippet if newspaper4k fails to fetch the full article.
    Returns empty list if Tavily returns no results.
    """
    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    query = f"{company_name} news this week"
    response: dict[str, Any] = client.search(
        query=query,
        max_results=8,
        search_depth="advanced",
    )

    results: list[dict[str, Any]] = response.get("results", [])

    if not results:
        print(f"⚠️  Tavily returned 0 results for '{company_name}' — skipping")
        return []

    articles: list[dict[str, str]] = []
    for item in results:
        title: str = item.get("title", "")
        url: str = item.get("url", "")
        snippet: str = item.get("content", "")
        source: str = _extract_source(url)

        content = _fetch_full_content(url, fallback=snippet)

        articles.append({
            "title": title,
            "url": url,
            "content": content,
            "source": source,
        })

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


def _extract_source(url: str) -> str:
    """Extract a readable source name from a URL."""
    try:
        from urllib.parse import urlparse
        hostname = urlparse(url).hostname or url
        # Strip www. prefix
        return hostname.removeprefix("www.")
    except Exception:
        return url
