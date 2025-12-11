import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9014';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate client for internal API routes (relative URLs)
const internalApiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : `http://localhost:${process.env.PORT || 3000}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await apiClient.get<RootResponse>('/');
    return response.data;
  },

  async getHealth(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<HealthCheckResponse>('/api/v1/sentiment/health');
    return response.data;
  },

  // POC Endpoints
  async analyzePOC(data: POCAnalyzeRequest): Promise<POCAnalyzeResponse> {
    const response = await apiClient.post<POCAnalyzeResponse>('/api/v1/sentiment/analyze/poc', data);
    return response.data;
  },

  async getPOCStatistics(params?: {
    platform?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<POCStatisticsResponse> {
    const response = await apiClient.get<POCStatisticsResponse>('/api/v1/sentiment/poc/statistics', {
      params,
    });
    return response.data;
  },

  async getPOCPosts(params?: POCPostsParams): Promise<POCPostsResponse> {
    const response = await apiClient.get<POCPostsResponse>('/api/v1/sentiment/poc/posts', {
      params,
    });
    return response.data;
  },

  // Production Endpoints
  async analyzeProduction(data: ProductionAnalyzeRequest): Promise<ProductionAnalyzeResponse> {
    const response = await apiClient.post<ProductionAnalyzeResponse>('/api/v1/sentiment/analyze', data);
    return response.data;
  },

  async analyzeBatch(data: BatchAnalyzeRequest): Promise<BatchAnalyzeResponse> {
    const response = await apiClient.post<BatchAnalyzeResponse>('/api/v1/sentiment/batch', data);
    return response.data;
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

