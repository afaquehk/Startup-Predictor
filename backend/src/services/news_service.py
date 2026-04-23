"""
News Service
Fetches latest news articles from Google News RSS
"""

import feedparser
import httpx
from typing import List, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class NewsService:
    def __init__(self):
        self.base_url = "https://news.google.com/rss/search"
    
    def is_ready(self) -> bool:
        """Check if service is ready"""
        return True
    
    async def get_news(self, company: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch latest news articles about a company from Google News RSS
        """
        try:
            # Build search query
            query = f"{company} startup OR {company} funding OR {company} company"
            
            # Fetch RSS feed
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    self.base_url,
                    params={
                        "q": query,
                        "hl": "en-US",
                        "gl": "US",
                        "ceid": "US:en"
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"News API error: {response.status_code}")
                    return []
                
                # Parse RSS feed
                feed = feedparser.parse(response.text)
                
                articles = []
                for entry in feed.entries[:limit]:
                    # Parse published date
                    published_date = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published_date = datetime(*entry.published_parsed[:6]).isoformat()
                    
                    articles.append({
                        "title": entry.get("title", ""),
                        "link": entry.get("link", ""),
                        "published": published_date,
                        "source": entry.get("source", {}).get("title", "Unknown"),
                        "snippet": self._clean_summary(entry.get("summary", ""))
                    })
                
                logger.info(f"Fetched {len(articles)} news articles for {company}")
                return articles
                
        except httpx.TimeoutException:
            logger.error(f"Timeout fetching news for {company}")
            return []
        except Exception as e:
            logger.error(f"Error fetching news: {str(e)}")
            return []
    
    def _clean_summary(self, summary: str) -> str:
        """
        Clean HTML tags and extra whitespace from summary
        """
        import re
        
        # Remove HTML tags
        clean = re.sub(r'<[^>]+>', '', summary)
        
        # Remove extra whitespace
        clean = ' '.join(clean.split())
        
        # Limit length
        if len(clean) > 200:
            clean = clean[:197] + "..."
        
        return clean
