import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9014';

// Use Next.js API routes as proxy to avoid CORS and Mixed Content issues
// Always use proxy route from client-side to avoid Mixed Content errors
const getApiUrl = (path: string) => {
  // Handle root path
  if (!path || path === '') {
    return '/api/proxy';
  }
  return `/api/proxy/${path}`;
};

// Helper function to parse error messages from API responses
const parseErrorMessage = (errorData: any, status: number, statusText: string): string => {
  // If details is a JSON string (from proxy), parse it
  if (errorData.details && typeof errorData.details === 'string') {
    try {
      const details = JSON.parse(errorData.details);
      if (details.detail && Array.isArray(details.detail) && details.detail.length > 0) {
        // Extract error messages from validation errors
        const messages = details.detail.map((err: any) => {
          if (err.msg) return err.msg;
          if (err.message) return err.message;
          if (err.loc && err.loc.length > 0) {
            return `${err.loc.join('.')}: ${err.msg || JSON.stringify(err)}`;
          }
          return JSON.stringify(err);
        }).join('\n');
        return messages;
      } else if (details.detail) {
        return typeof details.detail === 'string' ? details.detail : JSON.stringify(details.detail);
      }
    } catch (e) {
      // If parsing fails, use the details string as is
      return errorData.details;
    }
  }
  
  // Handle direct detail (array of validation errors)
  if (errorData.detail) {
    if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
      const messages = errorData.detail.map((err: any) => {
        if (err.msg) return err.msg;
        if (err.message) return err.message;
        if (err.loc && err.loc.length > 0) {
          return `${err.loc.join('.')}: ${err.msg || JSON.stringify(err)}`;
        }
        return JSON.stringify(err);
      }).join('\n');
      return messages;
    } else if (typeof errorData.detail === 'string') {
      return errorData.detail;
    } else {
      return JSON.stringify(errorData.detail);
    }
  }
  
  // Fallback to error or message fields
  return errorData.error || errorData.message || `HTTP ${status}: ${statusText}`;
};

// Types
export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  checks?: {
    database?: string;
    redis?: string;
    model?: string;
  };
}

export interface RootResponse {
  service: string;
  version: string;
  status: string;
  port: number;
}

export interface POCAnalyzeRequest {
  text: string;
  platform: 'tiktok' | 'instagram' | 'twitter' | 'youtube' | 'facebook';
  source_id?: number;
}

export interface POCAnalyzeResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
  processing_time: number;
  mode: string;
  platform: string;
  text_length: number;
}

export interface POCStatisticsResponse {
  summary: {
    total_posts_analyzed: number;
    date_range: {
      from: string;
      to: string;
    };
    avg_processing_time: number;
    avg_confidence: number;
  };
  sentiment_distribution: {
    positive: {
      count: number;
      percentage: number;
      avg_score: number;
    };
    negative: {
      count: number;
      percentage: number;
      avg_score: number;
    };
    neutral: {
      count: number;
      percentage: number;
      avg_score: number;
    };
  };
  platform_breakdown: Record<string, {
    count: number;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  performance_metrics: {
    latency_percentiles: {
      p50: number;
      p95: number;
      p99: number;
      max: number;
    };
    confidence_distribution: {
      high: number;
      medium: number;
      low: number;
    };
    text_length_stats: {
      avg: number;
      min: number;
      max: number;
    };
  };
  hourly_trend: Array<{
    hour: string;
    count: number;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

export interface POCPostsParams {
  platform?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  limit?: number;
  offset?: number;
  order_by?: 'created_at' | 'confidence' | 'processing_time';
  order_dir?: 'asc' | 'desc';
}

export interface POCPost {
  id: number;
  raw_social_post_id: number;
  platform: string;
  sentiment_label: string;
  sentiment_score: number;
  confidence: number;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
  processing_time: number;
  text_length: number;
  text_preview: string;
  created_at: string;
}

export interface POCPostsResponse {
  total: number;
  limit: number;
  offset: number;
  posts: POCPost[];
}

export interface ProductionAnalyzeRequest {
  content_id: number;
  content: string;
}

export interface ProductionAnalyzeResponse {
  content_id: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  confidence: number;
  positive_score: number;
  negative_score: number;
  neutral_score: number;
  processing_time: number;
  model_version: string;
}

export interface BatchItem {
  content_id: number;
  content: string;
}

export interface BatchAnalyzeRequest {
  items: BatchItem[];
}

export interface BatchResult {
  content_id: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  sentiment_score: number;
  confidence: number;
  processing_time: number | null;
}

export interface BatchAnalyzeResponse {
  results: BatchResult[];
  total_items: number;
  processing_time: number;
}

// Posts API Types
export interface Post {
  id: number;
  platform: string;
  source: string;
  post_id: string;
  account_username: string;
  content: string;
  media_urls: string[];
  engagement: Record<string, any>;
  posted_at: string;
  crawled_at: string;
  raw_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PostsPagination {
  count: number;
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
  offset: number;
  total: number;
  total_pages: number;
}

export interface PostsResponse {
  data: Post[];
  pagination: PostsPagination;
}

export interface PostsParams {
  limit?: number;
  offset?: number;
  platform?: string;
  source?: string;
}

// API Functions
export const api = {
  // Health Check
  async getRoot(): Promise<RootResponse> {
    const url = getApiUrl('');
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async getHealth(): Promise<HealthCheckResponse> {
    const url = getApiUrl('api/v1/sentiment/health');
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // POC Endpoints
  async analyzePOC(data: POCAnalyzeRequest): Promise<POCAnalyzeResponse> {
    const url = getApiUrl('api/v1/sentiment/analyze/poc');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = parseErrorMessage(errorData, response.status, response.statusText);
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async getPOCStatistics(params?: {
    platform?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<POCStatisticsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    const url = getApiUrl(`api/v1/sentiment/poc/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async getPOCPosts(params?: POCPostsParams): Promise<POCPostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.sentiment) queryParams.append('sentiment', params.sentiment);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.order_by) queryParams.append('order_by', params.order_by);
    if (params?.order_dir) queryParams.append('order_dir', params.order_dir);
    const url = getApiUrl(`api/v1/sentiment/poc/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Production Endpoints
  async analyzeProduction(data: ProductionAnalyzeRequest): Promise<ProductionAnalyzeResponse> {
    const url = getApiUrl('api/v1/sentiment/analyze');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = parseErrorMessage(errorData, response.status, response.statusText);
      throw new Error(errorMessage);
    }
    return response.json();
  },

  async analyzeBatch(data: BatchAnalyzeRequest): Promise<BatchAnalyzeResponse> {
    const url = getApiUrl('api/v1/sentiment/batch');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      const errorMessage = parseErrorMessage(errorData, response.status, response.statusText);
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Posts API (via Next.js API route to avoid CORS)
  async getPosts(params?: PostsParams): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.source) queryParams.append('source', params.source);
    
    const url = `/api/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    // Use fetch for relative URLs to avoid baseURL issues
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
};

