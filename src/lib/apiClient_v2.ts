/**
 * Enhanced API Client for Regulatory Data Endpoints (v2)
 *
 * Provides a resilient, strongly-typed HTTP client for fetching regulatory frameworks,
 * managing compliance questions, processing research data, and syncing markdown documentation.
 */

export interface ApiClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  headers?: Record<string, string>;
  apiKey?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  timestamp: string;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(status: number, errorDetails: ApiErrorDetails) {
    super(errorDetails.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = errorDetails.code;
    this.details = errorDetails.details;
  }
}

// Regulatory Domain Data Structures

export interface RegulatoryFramework {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'deprecated' | 'under_review';
  summary: string;
  tags: string[];
}

export interface RegulatoryDocument {
  id: string;
  frameworkId: string;
  title: string;
  contentMarkdown: string;
  version: string;
  lastUpdated: string;
  metadata: Record<string, unknown>;
}

export interface ComplianceQuestion {
  id: string;
  number: number;
  category: string;
  question: string;
  context?: string;
  regulatoryReferences: string[];
  status: 'open' | 'answered' | 'flagged_for_research';
  answerMarkdown?: string;
  followUpQuestions?: string[];
}

export interface ResearchGatheringPayload {
  batchId: string;
  frameworkIds: string[];
  answeredQuestions: ComplianceQuestion[];
  generatedResearchQuestions: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jurisdiction?: string;
  category?: string;
  [key: string]: string | number | boolean | undefined;
}

export class RegulatoryApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (config.baseUrl || '/api/v2').replace(/\/+$/, '');
    this.timeoutMs = config.timeoutMs ?? 15000;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelayMs = config.retryDelayMs ?? 1000;

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
      ...config.headers,
    };
  }

  /**
   * Helper to build query string from parameters dictionary
   */
  private buildQueryString(params?: QueryParams): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Internal fetch wrapper with timeout, retries, and exponential backoff
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorData: ApiErrorDetails;
        try {
          const parsed = await response.json();
          errorData = parsed.error || parsed || { code: 'UNKNOWN_ERROR', message: response.statusText };
        } catch {
          errorData = {
            code: 'HTTP_ERROR',
            message: `HTTP Request failed with status ${response.status}: ${response.statusText}`,
          };
        }

        // Retry recoverable server errors (5xx) or rate limits (429)
        if ((response.status >= 500 || response.status === 429) && attempt <= this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, attempt + 1);
        }

        throw new ApiClientError(response.status, errorData);
      }

      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      clearTimeout(timer);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt <= this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, attempt + 1);
        }
        throw new ApiClientError(408, {
          code: 'REQUEST_TIMEOUT',
          message: `Request exceeded timeout of ${this.timeoutMs}ms`,
        });
      }

      throw new ApiClientError(500, {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'An unknown network error occurred',
      });
    }
  }

  // Regulatory Frameworks API Endpoints

  /**
   * List regulatory frameworks with optional filters
   */
  public async getFrameworks(params?: QueryParams): Promise<ApiResponse<RegulatoryFramework[]>> {
    const query = this.buildQueryString(params);
    return this.request<RegulatoryFramework[]>(`/regulatory/frameworks${query}`);
  }

  /**
   * Get specific regulatory framework details
   */
  public async getFrameworkById(id: string): Promise<ApiResponse<RegulatoryFramework>> {
    return this.request<RegulatoryFramework>(`/regulatory/frameworks/${encodeURIComponent(id)}`);
  }

  // Compliance Questions & Markdown Batch API Endpoints

  /**
   * Retrieve initial compliance questions set (e.g. initial 20 questions)
   */
  public async getInitialQuestions(category?: string): Promise<ApiResponse<ComplianceQuestion[]>> {
    const query = this.buildQueryString({ category, limit: 20 });
    return this.request<ComplianceQuestion[]>(`/regulatory/questions/initial${query}`);
  }

  /**
   * Submit completed answers for questions
   */
  public async submitAnswers(answers: ComplianceQuestion[]): Promise<ApiResponse<{ processed: number; success: boolean }>> {
    return this.request<{ processed: number; success: boolean }>('/regulatory/questions/answers', {
      method: 'POST',
      body: JSON.stringify({ questions: answers }),
    });
  }

  /**
   * Fetch generated follow-up research questions (e.g. 20 gathered research questions)
   */
  public async getResearchQuestions(params?: QueryParams): Promise<ApiResponse<ComplianceQuestion[]>> {
    const query = this.buildQueryString(params);
    return this.request<ComplianceQuestion[]>(`/regulatory/questions/research${query}`);
  }

  /**
   * Submit aggregated research data gathered from initial & secondary question cycles
   */
  public async submitGatheredResearch(payload: ResearchGatheringPayload): Promise<ApiResponse<{ researchId: string; status: string }>> {
    return this.request<{ researchId: string; status: string }>('/regulatory/research/gather', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Markdown Document Sync Endpoints

  /**
   * Fetch markdown regulatory document by ID or path
   */
  public async getMarkdownDocument(docId: string): Promise<ApiResponse<RegulatoryDocument>> {
    return this.request<RegulatoryDocument>(`/regulatory/markdown/documents/${encodeURIComponent(docId)}`);
  }

  /**
   * Batch fetch markdown documents (e.g. for generating 20 question files)
   */
  public async getBatchMarkdownDocuments(params?: QueryParams): Promise<ApiResponse<RegulatoryDocument[]>> {
    const query = this.buildQueryString(params);
    return this.request<RegulatoryDocument[]>(`/regulatory/markdown/batch${query}`);
  }

  /**
   * Save or sync a generated markdown file
   */
  public async saveMarkdownDocument(document: Partial<RegulatoryDocument> & { id: string; contentMarkdown: string }): Promise<ApiResponse<RegulatoryDocument>> {
    return this.request<RegulatoryDocument>(`/regulatory/markdown/documents/${encodeURIComponent(document.id)}`, {
      method: 'PUT',
      body: JSON.stringify(document),
    });
  }

  /**
   * Sync 20 Q&A markdown files and research questions batch
   */
  public async syncQuestionBatch(data: {
    answeredDocs: { filename: string; content: string }[];
    researchQuestionsDoc: { filename: string; content: string };
  }): Promise<ApiResponse<{ syncedFiles: string[]; timestamp: string }>> {
    return this.request<{ syncedFiles: string[]; timestamp: string }>('/regulatory/markdown/sync-batch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Default export for convenient instantiation
export default new RegulatoryApiClient();