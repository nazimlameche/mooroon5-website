import os
import time
import google.generativeai as genai


def summarize(company_name: str, articles: list[dict[str, str]]) -> str:
    """Summarize and group articles about a company using Gemini Flash.

    Retries once after 5 seconds on API failure.
    Raises on second failure — caller handles the exception.
    """
    prompt = _build_prompt(company_name, articles)

    for attempt in range(2):
        try:
            return _call_gemini(prompt)
        except Exception as e:
            if attempt == 0:
                print(f"⚠️  Gemini API error (attempt 1): {e} — retrying in 5s")
                time.sleep(5)
            else:
                raise


def _build_prompt(company_name: str, articles: list[dict[str, str]]) -> str:
    lines: list[str] = [
        f"You are analyzing {len(articles)} recent news articles about {company_name}.",
        "",
        "STRICT FORMATTING RULES — follow these exactly:",
        "1. Output ONLY plain text. Absolutely NO markdown.",
        "   No **, no *, no ##, no -, no numbered lists, no backticks, no underscores.",
        "2. Group articles by theme (e.g. Financial Results, Product Launch, Leadership, Legal).",
        "3. Give each theme a WOW score from 1 to 10 based on business impact and relevance.",
        "   10 = major breaking news. 1 = minor or routine update.",
        "4. Every field must be on its own line with the exact prefix shown below.",
        "5. Summaries: 3 sentences on a single line, separated by periods. No line breaks inside.",
        "6. Insights: 1 sentence on a single line.",
        "",
        "OUTPUT FORMAT (copy this structure exactly):",
        "",
        "THEME: [theme name] | WOW: [score 1-10]",
        "TITLE: [article title]",
        "URL: [article url]",
        "SUMMARY: [sentence 1. sentence 2. sentence 3.]",
        "INSIGHT: [one key business takeaway]",
        "",
        "TITLE: [next article in same theme]",
        "URL: [url]",
        "SUMMARY: [sentence 1. sentence 2. sentence 3.]",
        "INSIGHT: [one key takeaway]",
        "",
        "THEME: [next theme name] | WOW: [score]",
        "TITLE: [article title]",
        "...",
        "",
        "GLOBAL:",
        "[5 sentences summarizing the company's full week. Plain text only. No line breaks inside.]",
        "",
        "--- ARTICLES TO ANALYZE ---",
        "",
    ]

    for i, article in enumerate(articles, start=1):
        lines.append(f"Article {i}: {article['title']}")
        lines.append(f"URL: {article['url']}")
        lines.append(f"Source: {article['source']}")
        lines.append(f"Published: {article.get('published_date', 'unknown')}")
        lines.append("")
        lines.append(article["content"][:2000])
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def _call_gemini(prompt: str) -> str:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        system_instruction=(
            "You are a professional financial and business analyst. "
            "You write clear, factual, concise summaries for busy executives. "
            "Never speculate. Never editorialize. Stick to the facts in the articles. "
            "Output plain text only — no markdown formatting of any kind."
        ),
    )

    response = model.generate_content(prompt)
    return response.text
