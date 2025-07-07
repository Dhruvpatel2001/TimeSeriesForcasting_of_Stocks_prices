import requests
from textblob import TextBlob

NEWS_API_KEY = "YOUR_NEWS_API_KEY"

def fetch_financial_news():
    url = f"https://newsapi.org/v2/everything?q=stocks&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    news_data = response.json()
    return news_data.get("articles", [])

def analyze_sentiment(text):
    return TextBlob(text).sentiment.polarity

def get_news_with_sentiment():
    articles = fetch_financial_news()
    for article in articles:
        article["sentiment"] = analyze_sentiment(article["title"])
    return articles
