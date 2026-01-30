/**
 * API клиент для работы с бэкендом
 */
/** В production без VITE_API_URL — относительный путь (тот же хост, nginx проксирует /api/) */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

export interface ApiError {
  detail: string;
}

/**
 * Класс для работы с API
 */
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Загружаем токен из localStorage
    this.token = localStorage.getItem('atii_auth_token');
  }

  /**
   * Установить JWT токен
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('atii_auth_token', token);
    } else {
      localStorage.removeItem('atii_auth_token');
    }
  }

  /**
   * Получить заголовки для запросов
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Базовый метод для выполнения запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('atii:auth:401', { detail: error.detail }));
          }
        }
        throw new Error(error.detail || 'Ошибка запроса');
      }

      // Если ответ пустой (204 No Content)
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  }

  // ========== Авторизация ==========

  async login(username: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    this.setToken(response.access_token);
    return response;
  }

  async register(username: string, email: string, password: string, isAdmin = false) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, is_admin: isAdmin }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // ========== Веб-сайты ==========

  async getWebsites(featured?: boolean) {
    const params = featured !== undefined ? `?featured=${featured}` : '';
    return this.request(`/websites${params}`);
  }

  async getWebsite(id: string) {
    return this.request(`/websites/${id}`);
  }

  async createWebsite(data: any) {
    return this.request('/websites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWebsite(id: string, data: any) {
    return this.request(`/websites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWebsite(id: string) {
    return this.request(`/websites/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Шаблоны ==========

  async getTemplates(status?: string) {
    const params = status ? `?status_filter=${status}` : '';
    return this.request(`/templates${params}`);
  }

  async getTemplate(id: string) {
    return this.request(`/templates/${id}`);
  }

  async createTemplate(data: any) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: string, data: any) {
    return this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== Страницы ==========

  async getPages() {
    return this.request('/pages');
  }

  async getPage(pageId: string) {
    return this.request(`/pages/${pageId}`);
  }

  async createPage(data: any) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(pageId: string, data: any) {
    return this.request(`/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(pageId: string) {
    return this.request(`/pages/${pageId}`, {
      method: 'DELETE',
    });
  }

  // ========== Настройки ==========

  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(data: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ========== Workflow схемы ==========

  async getWorkflowSchemas() {
    return this.request('/workflow-schemas');
  }

  async getWorkflowSchemaByTemplate(templateId: string) {
    return this.request(`/workflow-schemas/template/${templateId}`);
  }

  async createWorkflowSchema(data: any) {
    return this.request('/workflow-schemas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkflowSchema(templateId: string, data: any) {
    return this.request(`/workflow-schemas/template/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkflowSchema(templateId: string) {
    return this.request(`/workflow-schemas/template/${templateId}`, {
      method: 'DELETE',
    });
  }
}

// Экспортируем singleton экземпляр
export const apiClient = new ApiClient(API_BASE_URL);
