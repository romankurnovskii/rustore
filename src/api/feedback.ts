/**
 * API для работы с отзывами
 * Категория: Работа с отзывами с помощью RuStore API
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process
 */

import {RustoreApiClient} from './client.js';
import type {
  GetFeedbackResponse,
  GetFeedbackOptions,
  CreateFeedbackAnswerRequest,
  CreateFeedbackAnswerResponse,
  GetFeedbackAnswerStatusResponse,
  UpdateFeedbackAnswerRequest,
  UpdateFeedbackAnswerResponse,
  DeleteFeedbackAnswerResponse,
} from '../types.js';

/**
 * Клиент для работы с отзывами
 */
export class FeedbackApi extends RustoreApiClient {
  /**
   * Получить отзывы приложения
   * GET /public/v1/application/{packageName}/feedback
   *
   * Метод позволяет получить отзывы для указанного приложения.
   *
   * @param packageName - Наименование пакета приложения
   * @param options - Параметры запроса (continuationToken, pageSize и др.)
   * @returns Список отзывов
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process/get-feedback
   */
  async getFeedback(
    packageName: string,
    options?: GetFeedbackOptions,
  ): Promise<GetFeedbackResponse> {
    const endpoint = `/public/v1/application/${packageName}/feedback`;

    // Формируем query параметры
    const queryParams = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.get<GetFeedbackResponse>(finalEndpoint);
  }

  /**
   * Оставить ответ на отзыв
   * POST /public/v1/application/{packageName}/feedback/{commentId}/answer
   *
   * Метод позволяет оставить ответ на отзыв пользователя.
   *
   * @param packageName - Наименование пакета приложения
   * @param commentId - ID отзыва
   * @param data - Данные ответа (text)
   * @returns Информация о созданном ответе
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process/feedback-answer
   */
  async createFeedbackAnswer(
    packageName: string,
    commentId: number,
    data: CreateFeedbackAnswerRequest,
  ): Promise<CreateFeedbackAnswerResponse> {
    const endpoint = `/public/v1/application/${packageName}/feedback/${commentId}/answer`;
    return this.post<CreateFeedbackAnswerResponse>(endpoint, data);
  }

  /**
   * Получить статус ответа на отзыв
   * GET /public/v1/application/{packageName}/feedback/{feedbackId}
   *
   * Метод позволяет получить статус модерации ответа на отзыв или получить информацию
   * на отдельно взятый ответ на отзыв.
   *
   * @param packageName - Наименование пакета приложения
   * @param feedbackId - ID ответа на отзыв (необязательно, если не указан - возвращает все ответы)
   * @returns Информация о статусе ответа(ов)
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process/get-feedback-status
   */
  async getFeedbackAnswerStatus(
    packageName: string,
    feedbackId?: number,
  ): Promise<GetFeedbackAnswerStatusResponse> {
    const endpoint = feedbackId
      ? `/public/v1/application/${packageName}/feedback/${feedbackId}`
      : `/public/v1/application/${packageName}/feedback`;
    return this.get<GetFeedbackAnswerStatusResponse>(endpoint);
  }

  /**
   * Изменить ответ на отзыв
   * PUT /public/v1/application/{packageName}/feedback/{feedbackId}
   *
   * Метод позволяет изменить текст ответа на отзыв.
   *
   * @param packageName - Наименование пакета приложения
   * @param feedbackId - ID ответа на отзыв
   * @param data - Новые данные ответа (text)
   * @returns Информация об изменённом ответе
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process/change-feedback-answer
   */
  async updateFeedbackAnswer(
    packageName: string,
    feedbackId: number,
    data: UpdateFeedbackAnswerRequest,
  ): Promise<UpdateFeedbackAnswerResponse> {
    const endpoint = `/public/v1/application/${packageName}/feedback/${feedbackId}`;
    return this.put<UpdateFeedbackAnswerResponse>(endpoint, data);
  }

  /**
   * Удалить ответ на отзыв
   * DELETE /public/v1/application/{packageName}/feedback/{feedbackId}
   *
   * Метод позволяет удалить ответ на отзыв.
   *
   * @param packageName - Наименование пакета приложения
   * @param feedbackId - ID ответа на отзыв
   * @returns Результат удаления
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process/delete-feedback-answer
   */
  async deleteFeedbackAnswer(
    packageName: string,
    feedbackId: number,
  ): Promise<DeleteFeedbackAnswerResponse> {
    const endpoint = `/public/v1/application/${packageName}/feedback/${feedbackId}`;
    return this.delete<DeleteFeedbackAnswerResponse>(endpoint);
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с отзывами
 */
export const feedbackApi = new FeedbackApi();
