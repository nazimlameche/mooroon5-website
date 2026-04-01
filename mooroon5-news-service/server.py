"""
Local development server for the Mooroon5 News Service.
Run with: uvicorn server:app --reload --port 8000
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from fetcher import fetch_news
from summarizer import summarize
from email_sender import send_email

load_dotenv()

app = FastAPI(title="Mooroon5 News Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:4173"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class SendRequest(BaseModel):
    email: EmailStr
    company_name: str


class SendResponse(BaseModel):
    success: bool
    message: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/send", response_model=SendResponse)
def send_newsletter(req: SendRequest) -> SendResponse:
    """Fetch news, summarize, and send newsletter for the given company."""
    try:
        articles = fetch_news(req.company_name)
        if not articles:
            raise HTTPException(
                status_code=404,
                detail=f"No articles found for '{req.company_name}' this week.",
            )

        summary = summarize(req.company_name, articles)
        send_email(req.email, req.company_name, summary)

        return SendResponse(
            success=True,
            message=f"Newsletter sent to {req.email} for {req.company_name}.",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
