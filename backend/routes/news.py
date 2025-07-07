from fastapi import APIRouter
from services.sentiment_analysis import get_news_with_sentiment

router = APIRouter()

@router.get("/")
def get_news():
    return get_news_with_sentiment()
