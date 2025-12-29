/**
 * API для работы с платежами и подписками (методы приложений)
 * Категория: Работа с платежами и подписками (методы приложений)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app
 */

import {RustoreApiClient} from './client.js';
import type {
  GetInvoicesResponse,
  GetInvoicesOptions,
  GetPurchaseResponse,
  GetPurchaseListResponse,
  GetPurchaseListOptions,
} from '../types.js';

/**
 * Клиент для работы с платежами (методы приложений)
 */
export class PaymentsAppApi extends RustoreApiClient {
  /**
   * Получить список счетов приложения
   * GET /public/v1/application/{packageName}/invoice
   *
   * Метод позволяет получить список счетов для указанного приложения с поддержкой пагинации.
   *
   * @param packageName - Имя пакета приложения (например, com.example.app)
   * @param options - Параметры запроса (continuationToken, pageSize и др.)
   * @returns Список счетов
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-invoices
   */
  async getInvoices(
    packageName: string,
    options?: GetInvoicesOptions,
  ): Promise<GetInvoicesResponse> {
    const endpoint = `/public/v1/application/${packageName}/invoice`;

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

    return this.get<GetInvoicesResponse>(finalEndpoint);
  }

  /**
   * Получить информацию о покупке
   * GET /public/v1/application/{packageName}/purchase/{purchaseId}
   *
   * Метод позволяет получить детальную информацию о конкретной покупке.
   *
   * @param packageName - Имя пакета приложения (например, com.example.app)
   * @param purchaseId - ID покупки
   * @returns Информация о покупке
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase
   */
  async getPurchase(
    packageName: string,
    purchaseId: number,
  ): Promise<GetPurchaseResponse> {
    const endpoint = `/public/v1/application/${packageName}/purchase/${purchaseId}`;
    return this.get<GetPurchaseResponse>(endpoint);
  }

  /**
   * Получить список покупок приложения
   * GET /public/v1/application/{packageName}/purchase
   *
   * Метод позволяет получить список покупок для указанного приложения с поддержкой пагинации.
   *
   * @param packageName - Имя пакета приложения (например, com.example.app)
   * @param options - Параметры запроса (continuationToken, pageSize и др.)
   * @returns Список покупок
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase-list
   */
  async getPurchaseList(
    packageName: string,
    options?: GetPurchaseListOptions,
  ): Promise<GetPurchaseListResponse> {
    const endpoint = `/public/v1/application/${packageName}/purchase`;

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

    return this.get<GetPurchaseListResponse>(finalEndpoint);
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с платежами приложений
 */
export const paymentsAppApi = new PaymentsAppApi();
