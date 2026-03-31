import os
import time
import anthropic


def summarize(company_name: str, articles: list[dict[str, str]]) -> str:
    """Summarize a list of articles about a company using Claude Haiku.

    Retries once after 5 seconds on API failure.
    Raises on second failure — caller handles the exception.
    """
    prompt = _build_prompt(company_name, articles)

    for attempt in range(2):
        try:
            return _call_claude(prompt)
        except Exception as e:
            if attempt == 0:
                print(f"⚠️  Claude API error (attempt 1): {e} — retrying in 5s")
                time.sleep(5)
            else:
                raise


def _build_prompt(company_name: str, articles: list[dict[str, str]]) -> str:
    lines: list[str] = [
        f"Here are recent news articles about {company_name}.",
        "",
        "For EACH article below, provide:",
        "- Title",
        "- 3-line summary",
        "- One key insight",
        "- Source URL",
        "",
        "Then end with a 5-line global summary titled 'This Week in {company_name}'.",
        "Be factual, concise, and professional.",
        "",
        "--- ARTICLES ---",
        "",
    ]

    for i, article in enumerate(articles, start=1):
        lines.append(f"Article {i}: {article['title']}")
        lines.append(f"URL: {article['url']}")
        lines.append(f"Source: {article['source']}")
        lines.append("")
        lines.append(article["content"][:2000])  # cap per-article content
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def _call_claude(prompt: str) -> str:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=2048,
        system=(
            "You are a professional financial and business analyst. "
            "You write clear, factual, concise summaries for busy executives. "
            "Never speculate. Never editorialize. Stick to the facts in the articles."
        ),
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text
