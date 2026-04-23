/**
 * RiskRadar API Client
 * Handles all backend API communications
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// Types
// ============================================================================

export interface StartupSuggestion {
  name: string;
  sector: string;
  stage: string;
}

export interface StartupData {
  name: string;
  sector: string;
  stage: string;
  funding_millions: number;
  employees: number;
  founded_year: number;
  location: string;
  valuation_millions: number;
  description?: string;
  website?: string;
}

export interface RiskPrediction {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  probability: number;
  shap_values: Record<string, number>;
  feature_importance: Array<{ feature: string; impact: number }>;
  recommendations: string[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  created_at: string;
  updated_at: string;
  open_issues: number;
}

export interface NewsArticle {
  title: string;
  link: string;
  published: string;
  source: string;
  snippet: string;
}

export interface StockData {
  ticker: string;
  name: string;
  current_price: number;
  previous_close: number;
  price_change: number;
  price_change_percent: number;
  market_cap: number;
  volume: number;
  historical_prices: Array<{ date: string; price: number }>;
}

export interface ComparableStartup extends StartupData {
  similarity_score?: number;
}

// ============================================================================
// API Client Class
// ============================================================================

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    return this.request<{
      status: string;
      services: Record<string, boolean>;
    }>('/api/health');
  }

  // Startup Suggestions (Autocomplete)
  async suggestStartups(query: string, limit: number = 10) {
    return this.request<{
      query: string;
      suggestions: StartupSuggestion[];
      count: number;
    }>(`/api/startups/suggest?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Lookup Startup in Dataset
  async lookupStartup(name: string, fuzzy: boolean = true) {
    return this.request<{
      found: boolean;
      data?: StartupData;
      message?: string;
    }>('/api/startups/lookup', {
      method: 'POST',
      body: JSON.stringify({ name, fuzzy }),
    });
  }

  // Enrich Unknown Startup
  async enrichStartup(name: string, website?: string) {
    return this.request<{
      success: boolean;
      name: string;
      data: StartupData;
      sources: string[];
    }>('/api/enrich', {
      method: 'POST',
      body: JSON.stringify({ name, website }),
    });
  }

  // Predict Risk Score
  async predictRisk(startupData: Partial<StartupData>) {
    return this.request<{
      success: boolean;
    } & RiskPrediction>('/api/predict', {
      method: 'POST',
      body: JSON.stringify({ startup_data: startupData }),
    });
  }

  // Get GitHub Repos
  async getGitHubRepos(org: string, limit: number = 10) {
    return this.request<{
      success: boolean;
      organization: string;
      repositories: GitHubRepo[];
      total_repos: number;
      summary: {
        total_repos: number;
        total_stars: number;
        total_forks: number;
        avg_stars: number;
        top_languages: Array<{ language: string; count: number }>;
        most_starred: GitHubRepo;
      };
    }>(`/api/github/${encodeURIComponent(org)}?limit=${limit}`);
  }

  // Get News Articles
  async getNews(company: string, limit: number = 10) {
    return this.request<{
      success: boolean;
      company: string;
      articles: NewsArticle[];
      count: number;
    }>(`/api/news/${encodeURIComponent(company)}?limit=${limit}`);
  }

  // Get Stock Data
  async getStockData(ticker: string) {
    return this.request<{
      success: boolean;
      ticker: string;
      data?: StockData;
      message?: string;
    }>(`/api/stock/${encodeURIComponent(ticker)}`);
  }

  // Get Comparable Startups
  async getComparables(sector: string, stage?: string, limit: number = 10) {
    return this.request<{
      success: boolean;
      sector: string;
      stage?: string;
      comparables: ComparableStartup[];
      count: number;
      benchmarks: {
        avg_funding: number;
        median_funding: number;
        avg_valuation: number;
        median_valuation: number;
        avg_employees: number;
        median_employees: number;
        total_companies: number;
      };
    }>('/api/comparables', {
      method: 'POST',
      body: JSON.stringify({ sector, stage, limit }),
    });
  }
}

// Export singleton instance
export const api = new APIClient();

// Export class for custom instances
export default APIClient;
