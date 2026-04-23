"""
Dataset Service
Handles startup dataset loading, searching, and filtering
"""

import json
import os
from typing import List, Dict, Optional, Any
from fuzzywuzzy import fuzz, process
import logging

logger = logging.getLogger(__name__)

class DatasetService:
    def __init__(self, dataset_path: str = "dataset/startups.json"):
        self.dataset_path = dataset_path
        self.startups: List[Dict[str, Any]] = []
        self._load_dataset()
    
    def _load_dataset(self):
        """Load startup dataset from JSON"""
        try:
            if os.path.exists(self.dataset_path):
                with open(self.dataset_path, 'r') as f:
                    self.startups = json.load(f)
                logger.info(f"Dataset loaded: {len(self.startups)} startups")
            else:
                logger.warning(f"Dataset not found at {self.dataset_path}, creating sample data")
                self._create_sample_dataset()
        except Exception as e:
            logger.error(f"Error loading dataset: {str(e)}")
            self._create_sample_dataset()
    
    def _create_sample_dataset(self):
        """Create sample dataset for demo purposes"""
        self.startups = [
            {'name': 'Stripe', 'sector': 'FinTech', 'stage': 'Series H', 'funding_millions': 2200, 'employees': 8000, 'founded_year': 2010, 'location': 'San Francisco, CA', 'valuation_millions': 95000},
            {'name': 'Airbnb', 'sector': 'Travel', 'stage': 'Series F', 'funding_millions': 6400, 'employees': 6800, 'founded_year': 2008, 'location': 'San Francisco, CA', 'valuation_millions': 31000},
            {'name': 'Uber', 'sector': 'Transportation', 'stage': 'Series G', 'funding_millions': 25200, 'employees': 32000, 'founded_year': 2009, 'location': 'San Francisco, CA', 'valuation_millions': 82000},
            {'name': 'SpaceX', 'sector': 'Aerospace', 'stage': 'Series N', 'funding_millions': 9800, 'employees': 12000, 'founded_year': 2002, 'location': 'Hawthorne, CA', 'valuation_millions': 150000},
            {'name': 'OpenAI', 'sector': 'AI/ML', 'stage': 'Series C', 'funding_millions': 11300, 'employees': 1500, 'founded_year': 2015, 'location': 'San Francisco, CA', 'valuation_millions': 29000},
            {'name': 'Databricks', 'sector': 'Data Analytics', 'stage': 'Series H', 'funding_millions': 3800, 'employees': 5000, 'founded_year': 2013, 'location': 'San Francisco, CA', 'valuation_millions': 43000},
            {'name': 'Figma', 'sector': 'Design', 'stage': 'Series D', 'funding_millions': 800, 'employees': 800, 'founded_year': 2012, 'location': 'San Francisco, CA', 'valuation_millions': 20000},
            {'name': 'Notion', 'sector': 'Productivity', 'stage': 'Series C', 'funding_millions': 343, 'employees': 400, 'founded_year': 2013, 'location': 'San Francisco, CA', 'valuation_millions': 10000},
            {'name': 'Discord', 'sector': 'Social', 'stage': 'Series H', 'funding_millions': 980, 'employees': 600, 'founded_year': 2015, 'location': 'San Francisco, CA', 'valuation_millions': 15000},
            {'name': 'Canva', 'sector': 'Design', 'stage': 'Series D', 'funding_millions': 560, 'employees': 2500, 'founded_year': 2013, 'location': 'Sydney, Australia', 'valuation_millions': 26000},
            {'name': 'Instacart', 'sector': 'E-commerce', 'stage': 'Series F', 'funding_millions': 2700, 'employees': 10000, 'founded_year': 2012, 'location': 'San Francisco, CA', 'valuation_millions': 39000},
            {'name': 'Robinhood', 'sector': 'FinTech', 'stage': 'Series D', 'funding_millions': 5600, 'employees': 3600, 'founded_year': 2013, 'location': 'Menlo Park, CA', 'valuation_millions': 11700},
            {'name': 'Coinbase', 'sector': 'Crypto', 'stage': 'Public', 'funding_millions': 547, 'employees': 4700, 'founded_year': 2012, 'location': 'San Francisco, CA', 'valuation_millions': 85000},
            {'name': 'Plaid', 'sector': 'FinTech', 'stage': 'Series D', 'funding_millions': 734, 'employees': 700, 'founded_year': 2013, 'location': 'San Francisco, CA', 'valuation_millions': 13400},
            {'name': 'Chime', 'sector': 'FinTech', 'stage': 'Series F', 'funding_millions': 2300, 'employees': 1500, 'founded_year': 2013, 'location': 'San Francisco, CA', 'valuation_millions': 25000},
            {'name': 'Rippling', 'sector': 'HR Tech', 'stage': 'Series D', 'funding_millions': 700, 'employees': 2000, 'founded_year': 2016, 'location': 'San Francisco, CA', 'valuation_millions': 11200},
            {'name': 'Brex', 'sector': 'FinTech', 'stage': 'Series C', 'funding_millions': 1200, 'employees': 1200, 'founded_year': 2017, 'location': 'San Francisco, CA', 'valuation_millions': 12300},
            {'name': 'Gusto', 'sector': 'HR Tech', 'stage': 'Series E', 'funding_millions': 700, 'employees': 2400, 'founded_year': 2011, 'location': 'San Francisco, CA', 'valuation_millions': 9600},
            {'name': 'Airtable', 'sector': 'Productivity', 'stage': 'Series D', 'funding_millions': 1400, 'employees': 1000, 'founded_year': 2012, 'location': 'San Francisco, CA', 'valuation_millions': 11000},
            {'name': 'Miro', 'sector': 'Collaboration', 'stage': 'Series C', 'funding_millions': 476, 'employees': 1800, 'founded_year': 2011, 'location': 'San Francisco, CA', 'valuation_millions': 17500},
        ]
        
        # Create dataset directory if it doesn't exist
        os.makedirs(os.path.dirname(self.dataset_path) if os.path.dirname(self.dataset_path) else "dataset", exist_ok=True)
        
        # Save sample dataset
        with open(self.dataset_path, 'w') as f:
            json.dump(self.startups, f, indent=2)
        
        logger.info(f"Sample dataset created with {len(self.startups)} startups")
    
    def is_ready(self) -> bool:
        """Check if dataset is loaded"""
        return len(self.startups) > 0
    
    def get_count(self) -> int:
        """Get total number of startups"""
        return len(self.startups)
    
    def suggest(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Autocomplete suggestions based on query
        Returns list of matching startup names
        """
        if not self.is_ready():
            return []
        
        query_lower = query.lower()
        
        # Filter startups that contain the query
        matches = [
            {
                "name": startup['name'],
                "sector": startup['sector'],
                "stage": startup['stage']
            }
            for startup in self.startups
            if query_lower in startup['name'].lower()
        ][:limit]
        
        return matches
    
    def lookup(self, name: str, fuzzy: bool = True) -> Optional[Dict[str, Any]]:
        """
        Find startup by name (exact or fuzzy match)
        Returns full startup data if found
        """
        if not self.is_ready():
            return None
        
        # Try exact match first
        for startup in self.startups:
            if startup['name'].lower() == name.lower():
                return startup.copy()
        
        # Try fuzzy matching if enabled
        if fuzzy:
            names = [s['name'] for s in self.startups]
            best_match = process.extractOne(name, names, scorer=fuzz.ratio)
            
            if best_match and best_match[1] >= 80:  # 80% similarity threshold
                for startup in self.startups:
                    if startup['name'] == best_match[0]:
                        return startup.copy()
        
        return None
    
    def get_comparables(
        self,
        sector: str,
        stage: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find comparable startups by sector and stage
        """
        if not self.is_ready():
            return []
        
        # Filter by sector
        filtered = [s for s in self.startups if s['sector'].lower() == sector.lower()]
        
        # Filter by stage if provided
        if stage:
            filtered = [s for s in filtered if s['stage'].lower() == stage.lower()]
        
        # Sort by valuation (descending) and limit results
        filtered.sort(key=lambda x: x.get('valuation_millions', 0), reverse=True)
        
        return filtered[:limit]
    
    def calculate_benchmarks(self, comparables: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate benchmark statistics from comparable startups
        """
        if not comparables:
            return {}
        
        funding_values = [c['funding_millions'] for c in comparables]
        valuation_values = [c['valuation_millions'] for c in comparables]
        employee_values = [c['employees'] for c in comparables]
        
        return {
            "avg_funding": sum(funding_values) / len(funding_values),
            "median_funding": sorted(funding_values)[len(funding_values) // 2],
            "avg_valuation": sum(valuation_values) / len(valuation_values),
            "median_valuation": sorted(valuation_values)[len(valuation_values) // 2],
            "avg_employees": sum(employee_values) / len(employee_values),
            "median_employees": sorted(employee_values)[len(employee_values) // 2],
            "total_companies": len(comparables)
        }
    
    def get_all_sectors(self) -> List[str]:
        """Get list of all unique sectors"""
        if not self.is_ready():
            return []
        return sorted(list(set(s['sector'] for s in self.startups)))
    
    def get_all_stages(self) -> List[str]:
        """Get list of all unique funding stages"""
        if not self.is_ready():
            return []
        return sorted(list(set(s['stage'] for s in self.startups)))
