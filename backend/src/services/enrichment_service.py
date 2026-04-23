"""
Enrichment Service
Web scraping and data enrichment for unknown startups
"""

import httpx
from bs4 import BeautifulSoup
from typing import Dict, Optional, Any, List
import logging
import re
from datetime import datetime

logger = logging.getLogger(__name__)

class EnrichmentService:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    
    async def enrich(self, name: str, website: Optional[str] = None) -> Dict[str, Any]:
        """
        Orchestrate data enrichment from multiple sources
        """
        enriched_data = {
            "name": name,
            "website": website,
            "sources": [],
            "enriched_at": datetime.now().isoformat()
        }
        
        # Search for company information
        search_data = await self._search_company(name)
        if search_data:
            enriched_data.update(search_data)
            enriched_data["sources"].append("web_search")
        
        # If website provided, scrape it
        if website:
            website_data = await self._scrape_website(website)
            if website_data:
                enriched_data.update(website_data)
                enriched_data["sources"].append("company_website")
        
        # Try to find Crunchbase data
        crunchbase_data = await self._search_crunchbase(name)
        if crunchbase_data:
            enriched_data.update(crunchbase_data)
            enriched_data["sources"].append("crunchbase")
        
        # Estimate missing values
        enriched_data = self._estimate_missing_values(enriched_data)
        
        return enriched_data
    
    async def _search_company(self, name: str) -> Dict[str, Any]:
        """
        Search for company information using DuckDuckGo
        """
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                # Use DuckDuckGo instant answer API
                response = await client.get(
                    "https://api.duckduckgo.com/",
                    params={
                        "q": f"{name} startup company",
                        "format": "json",
                        "no_html": 1
                    },
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    result = {}
                    
                    # Extract description
                    if data.get("Abstract"):
                        result["description"] = data["Abstract"]
                    elif data.get("AbstractText"):
                        result["description"] = data["AbstractText"]
                    
                    # Extract website
                    if data.get("AbstractURL"):
                        result["website"] = data["AbstractURL"]
                    
                    return result
                
        except Exception as e:
            logger.error(f"Error searching for company: {str(e)}")
        
        return {}
    
    async def _scrape_website(self, url: str) -> Dict[str, Any]:
        """
        Scrape company website for information
        """
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                response = await client.get(url, headers=self.headers)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    result = {}
                    
                    # Try to extract description from meta tags
                    meta_desc = soup.find('meta', attrs={'name': 'description'})
                    if meta_desc and meta_desc.get('content'):
                        result["description"] = meta_desc['content']
                    
                    # Try to extract title
                    if soup.title:
                        result["title"] = soup.title.string
                    
                    return result
                
        except Exception as e:
            logger.error(f"Error scraping website: {str(e)}")
        
        return {}
    
    async def _search_crunchbase(self, name: str) -> Dict[str, Any]:
        """
        Search for company on Crunchbase (public data only)
        """
        try:
            # Note: This is a simplified version. Full Crunchbase access requires API key.
            # This searches public Crunchbase pages
            
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                search_url = f"https://www.crunchbase.com/organization/{name.lower().replace(' ', '-')}"
                
                response = await client.get(search_url, headers=self.headers)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    result = {}
                    
                    # Try to extract basic information
                    # Note: Crunchbase structure changes frequently, this is a basic example
                    
                    # Look for funding information in text
                    text = soup.get_text()
                    
                    # Try to find funding amount
                    funding_match = re.search(r'\$([0-9.]+)([MBK])', text)
                    if funding_match:
                        amount = float(funding_match.group(1))
                        unit = funding_match.group(2)
                        
                        if unit == 'K':
                            amount = amount / 1000
                        elif unit == 'B':
                            amount = amount * 1000
                        
                        result["funding_millions"] = amount
                    
                    # Try to find employee count
                    employee_match = re.search(r'(\d+)\s*employees', text, re.IGNORECASE)
                    if employee_match:
                        result["employees"] = int(employee_match.group(1))
                    
                    # Try to find founded year
                    founded_match = re.search(r'Founded\s*:?\s*(\d{4})', text, re.IGNORECASE)
                    if founded_match:
                        result["founded_year"] = int(founded_match.group(1))
                    
                    return result
                
        except Exception as e:
            logger.error(f"Error searching Crunchbase: {str(e)}")
        
        return {}
    
    def _estimate_missing_values(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Estimate missing values based on available data
        """
        # Estimate employees if not found
        if "employees" not in data:
            funding = data.get("funding_millions", 0)
            if funding > 100:
                data["employees"] = 500
            elif funding > 50:
                data["employees"] = 200
            elif funding > 20:
                data["employees"] = 100
            elif funding > 5:
                data["employees"] = 50
            else:
                data["employees"] = 20
        
        # Estimate funding if not found
        if "funding_millions" not in data:
            employees = data.get("employees", 0)
            if employees > 500:
                data["funding_millions"] = 100
            elif employees > 200:
                data["funding_millions"] = 50
            elif employees > 100:
                data["funding_millions"] = 20
            elif employees > 50:
                data["funding_millions"] = 10
            else:
                data["funding_millions"] = 5
        
        # Estimate founded year if not found
        if "founded_year" not in data:
            data["founded_year"] = datetime.now().year - 3  # Assume 3 years old
        
        # Calculate years since founded
        if "founded_year" in data:
            data["years_since_founded"] = datetime.now().year - data["founded_year"]
        
        # Estimate valuation based on funding
        if "valuation_millions" not in data and "funding_millions" in data:
            # Rough estimate: valuation is typically 3-5x total funding
            data["valuation_millions"] = data["funding_millions"] * 4
        
        # Set default sector if not found
        if "sector" not in data:
            data["sector"] = "Technology"
        
        # Set default stage if not found
        if "stage" not in data:
            funding = data.get("funding_millions", 0)
            if funding < 2:
                data["stage"] = "Seed"
            elif funding < 10:
                data["stage"] = "Series A"
            elif funding < 30:
                data["stage"] = "Series B"
            elif funding < 100:
                data["stage"] = "Series C"
            else:
                data["stage"] = "Series D+"
        
        # Set default location if not found
        if "location" not in data:
            data["location"] = "San Francisco, CA"
        
        return data
