/**
 * Клиент для работы с RuStore API
 */

import {getToken} from './auth.js';
import type {ApiError} from '../types.js';

const API_BASE_URL = 'https://public-api.rustore.ru';

/**
 * Базовый класс для работы с API
 */
export class RustoreApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Выполняет авторизованный запрос к API
   */
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await getToken();
    const url = `${this.baseUrl}${endpoint}`;

    // Debug: логируем URL для отладки (можно убрать в production)
    if (process.env.DEBUG) {
      console.error(`[DEBUG] API Request: ${url}`);
    }

    // Определяем заголовки: для multipart/form-data не устанавливаем Content-Type
    // (браузер/fetch установит его автоматически с boundary)
    const isMultipart = options.body instanceof FormData;
    const headers: Record<string, string> = {
      'Public-Token': token, // JWE токен из login передаётся в заголовке Public-Token
      ...(options.headers as Record<string, string>),
    };

    // Для JSON запросов добавляем Content-Type
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    // RuStore API использует JWE токен в заголовке Public-Token
    // Токен получается через login и передаётся в заголовке Public-Token
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: ApiError | undefined;

      try {
        errorData = JSON.parse(errorText) as ApiError;
      } catch {
        // Игнорируем ошибку парсинга
      }

      // Более информативное сообщение об ошибке
      const errorMessage = errorData?.message ?? errorText;
      throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
    }

    return (await response.json()) as T;
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {method: 'GET'});
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {method: 'DELETE'});
  }
}

/**
 * Экспортируемый экземпляр клиента
 */
export const apiClient = new RustoreApiClient();
