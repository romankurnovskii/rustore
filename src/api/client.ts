/**
 * Клиент для работы с RuStore API
 *
 * Базовый класс для всех API клиентов RuStore.
 * Предоставляет методы для выполнения авторизованных запросов.
 *
 * @see https://www.rustore.ru/help/en/work-with-rustore-api
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

    // Debug: логируем URL и тело запроса для отладки
    if (process.env.DEBUG) {
      console.error(`[DEBUG] API Request: ${options.method || 'GET'} ${url}`);
      if (options.body && !(options.body instanceof FormData)) {
        try {
          const bodyText =
            typeof options.body === 'string'
              ? options.body
              : JSON.stringify(options.body);
          console.error(`[DEBUG] API Request Body:`, bodyText);
        } catch {
          console.error(`[DEBUG] API Request Body: [unable to stringify]`);
        }
      }
      if (options.body instanceof FormData) {
        console.error(`[DEBUG] API Request Body: [FormData - multipart/form-data]`);
      }
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

    // Получаем текст ответа для логирования и парсинга
    const responseText = await response.text();

    // Debug: логируем сырой ответ API
    if (process.env.DEBUG) {
      console.error(
        `[DEBUG] API Response Status: ${response.status} ${response.statusText}`,
      );
      console.error(
        `[DEBUG] API Response Headers:`,
        Object.fromEntries(response.headers.entries()),
      );
      console.error(`[DEBUG] API Response Body:`, responseText);
    }

    if (!response.ok) {
      let errorData: ApiError | undefined;

      try {
        errorData = JSON.parse(responseText) as ApiError;
      } catch {
        // Игнорируем ошибку парсинга
      }

      // Более информативное сообщение об ошибке
      const errorMessage = errorData?.message ?? responseText;
      throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
    }

    // Парсим JSON ответ
    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      if (process.env.DEBUG) {
        console.error(`[DEBUG] Failed to parse JSON response:`, parseError);
      }
      throw new Error(`Ошибка парсинга ответа API: ${responseText}`);
    }
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
