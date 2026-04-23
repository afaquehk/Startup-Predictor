"""
GitHub Service
Fetches repository data from GitHub API
"""

import httpx
import os
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.token = os.getenv("GITHUB_TOKEN")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "RiskRadar-API"
        }
        
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"
            logger.info("GitHub API initialized with authentication")
        else:
            logger.warning("GitHub API initialized without token (rate limit: 60 req/hr)")
    
    def is_ready(self) -> bool:
        """Check if service is ready"""
        return True
    
    async def get_org_repos(self, org: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch repositories for a GitHub organization
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Get organization repos
                response = await client.get(
                    f"{self.base_url}/orgs/{org}/repos",
                    headers=self.headers,
                    params={
                        "sort": "updated",
                        "per_page": limit,
                        "type": "public"
                    }
                )
                
                if response.status_code == 404:
                    logger.warning(f"Organization not found: {org}")
                    return []
                
                if response.status_code != 200:
                    logger.error(f"GitHub API error: {response.status_code}")
                    return []
                
                repos_data = response.json()
                
                # Extract relevant information
                repos = []
                for repo in repos_data:
                    repos.append({
                        "name": repo.get("name"),
                        "description": repo.get("description"),
                        "url": repo.get("html_url"),
                        "stars": repo.get("stargazers_count", 0),
                        "forks": repo.get("forks_count", 0),
                        "watchers": repo.get("watchers_count", 0),
                        "language": repo.get("language"),
                        "created_at": repo.get("created_at"),
                        "updated_at": repo.get("updated_at"),
                        "open_issues": repo.get("open_issues_count", 0),
                        "size": repo.get("size", 0),
                        "default_branch": repo.get("default_branch", "main")
                    })
                
                logger.info(f"Fetched {len(repos)} repositories for {org}")
                return repos
                
        except httpx.TimeoutException:
            logger.error(f"Timeout fetching repos for {org}")
            return []
        except Exception as e:
            logger.error(f"Error fetching GitHub repos: {str(e)}")
            return []
    
    async def get_repo_languages(self, org: str, repo: str) -> Dict[str, int]:
        """
        Get language breakdown for a specific repository
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/repos/{org}/{repo}/languages",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    return response.json()
                
                return {}
                
        except Exception as e:
            logger.error(f"Error fetching languages: {str(e)}")
            return {}
    
    async def get_repo_commits(self, org: str, repo: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent commits for a repository
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/repos/{org}/{repo}/commits",
                    headers=self.headers,
                    params={"per_page": limit}
                )
                
                if response.status_code == 200:
                    commits_data = response.json()
                    return [
                        {
                            "sha": commit.get("sha", "")[:7],
                            "message": commit.get("commit", {}).get("message", ""),
                            "author": commit.get("commit", {}).get("author", {}).get("name", ""),
                            "date": commit.get("commit", {}).get("author", {}).get("date", "")
                        }
                        for commit in commits_data
                    ]
                
                return []
                
        except Exception as e:
            logger.error(f"Error fetching commits: {str(e)}")
            return []
    
    def get_summary(self, repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate summary statistics from repository data
        """
        if not repos:
            return {}
        
        total_stars = sum(repo.get("stars", 0) for repo in repos)
        total_forks = sum(repo.get("forks", 0) for repo in repos)
        
        # Language distribution
        languages = {}
        for repo in repos:
            lang = repo.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
        
        # Sort languages by count
        top_languages = sorted(
            languages.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
        
        return {
            "total_repos": len(repos),
            "total_stars": total_stars,
            "total_forks": total_forks,
            "avg_stars": round(total_stars / len(repos), 1) if repos else 0,
            "top_languages": [{"language": lang, "count": count} for lang, count in top_languages],
            "most_starred": max(repos, key=lambda x: x.get("stars", 0)) if repos else None
        }
