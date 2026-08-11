import {
  ResearchQuestion,
  AnswerPayload,
  MarkdownDocument,
  Ingredient,
  IngredientQueryParams,
  ResearchSummary,
  ApiResponse,
  ApiClientConfig,
  QuestionFilter
} from '../types';

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '/api';
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    };
  }

  /**
   * Helper function to execute HTTP requests with error handling and timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      clearTimeout(id);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          `API request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error: unknown) {
      clearTimeout(id);
      if (error instanceof ApiError) {
        throw error;
      }
      
      const message = error instanceof Error ? error.message : 'Unknown network error';
      throw new ApiError(message, 500, error);
    }
  }

  // ==========================================
  // Research Questions Methods
  // ==========================================

  /**
   * Fetch research questions filtered by phase ('initial_20' | 'followup_20' | 'all')
   */
  public async getQuestions(filter?: QuestionFilter): Promise<ApiResponse<ResearchQuestion[]>> {
    const query = new URLSearchParams();
    if (filter?.phase) query.append('phase', filter.phase);
    if (filter?.status) query.append('status', filter.status);
    if (filter?.category) query.append('category', filter.category);

    const queryString = query.toString();
    const endpoint = `/questions${queryString ? `?${queryString}` : ''}`;
    return this.request<ResearchQuestion[]>(endpoint, { method: 'GET' });
  }

  /**
   * Fetch a single question by ID
   */
  public async getQuestionById(id: string): Promise<ApiResponse<ResearchQuestion>> {
    return this.request<ResearchQuestion>(`/questions/${id}`, { method: 'GET' });
  }

  /**
   * Create or update an answer for a specific question
   */
  public async saveAnswer(
    questionId: string,
    payload: AnswerPayload
  ): Promise<ApiResponse<ResearchQuestion>> {
    return this.request<ResearchQuestion>(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ==========================================
  // Markdown Document Methods
  // ==========================================

  /**
   * List all generated Markdown files (e.g., initial 20 answered files + follow-up research files)
   */
  public async getMarkdownFiles(): Promise<ApiResponse<MarkdownDocument[]>> {
    return this.request<MarkdownDocument[]>('/markdown-files', { method: 'GET' });
  }

  /**
   * Get contents of a specific markdown file by path or ID
   */
  public async getMarkdownFile(id: string): Promise<ApiResponse<MarkdownDocument>> {
    return this.request<MarkdownDocument>(`/markdown-files/${id}`, { method: 'GET' });
  }

  /**
   * Export or generate markdown file for a given question and answer
   */
  public async generateMarkdownFile(
    questionId: string
  ): Promise<ApiResponse<MarkdownDocument>> {
    return this.request<MarkdownDocument>(`/markdown-files/generate`, {
      method: 'POST',
      body: JSON.stringify({ questionId }),
    });
  }

  /**
   * Bulk compile all answered questions into markdown batch
   */
  public async compileAllMarkdown(phase: 'initial_20' | 'followup_20'): Promise<ApiResponse<MarkdownDocument[]>> {
    return this.request<MarkdownDocument[]>(`/markdown-files/compile-batch`, {
      method: 'POST',
      body: JSON.stringify({ phase }),
    });
  }

  // ==========================================
  // Ingredient Database Methods
  // ==========================================

  /**
   * Query the ingredients database
   */
  public async getIngredients(params?: IngredientQueryParams): Promise<ApiResponse<Ingredient[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('q', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    const queryString = query.toString();
    return this.request<Ingredient[]>(`/ingredients${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Fetch detailed information about a single ingredient by ID or INCI name
   */
  public async getIngredientById(id: string): Promise<ApiResponse<Ingredient>> {
    return this.request<Ingredient>(`/ingredients/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }

  // ==========================================
  // Synthesis & Research Aggregation Methods
  // ==========================================

  /**
   * Gather answered data from initial questions and trigger research synthesis for secondary 20 questions
   */
  public async synthesizeResearch(): Promise<ApiResponse<ResearchSummary>> {
    return this.request<ResearchSummary>('/research/synthesize', {
      method: 'POST',
    });
  }

  /**
   * Execute cross-reference research search across ingredients and current answers
   */
  public async searchResearchData(query: string): Promise<ApiResponse<ResearchSummary>> {
    return this.request<ResearchSummary>('/research/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }
}

// Default export singleton instance
export const apiClient = new ApiClient();