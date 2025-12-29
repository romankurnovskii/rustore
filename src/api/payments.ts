/**
 * API для работы с платежами и подписками
 * Категория: Работа с платежами и подписками (общие методы)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions
 */

import {RustoreApiClient} from './client.js';
import type {
  GetPaymentResponse,
  GetSubscriptionResponse,
  GetSubscriptionListResponse,
  GetSubscriptionListOptions,
} from '../types.js';

/**
 * Клиент для работы с платежами (общие методы)
 */
export class PaymentsApi extends RustoreApiClient {
  /**
   * Получить информацию о платеже
   * GET /public/v1/payment/{paymentId}
   *
   * Метод позволяет получить детальную информацию о конкретном платеже.
   *
   * @param paymentId - ID платежа
   * @returns Информация о платеже
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-payment
   */
  async getPayment(paymentId: number): Promise<GetPaymentResponse> {
    const endpoint = `/public/v1/payment/${paymentId}`;
    return this.get<GetPaymentResponse>(endpoint);
  }

  /**
   * Получить информацию о подписке
   * GET /public/v1/subscription/{subscriptionId}
   *
   * Метод позволяет получить детальную информацию о конкретной подписке.
   *
   * @param subscriptionId - ID подписки
   * @returns Информация о подписке
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription
   */
  async getSubscription(subscriptionId: number): Promise<GetSubscriptionResponse> {
    const endpoint = `/public/v1/subscription/${subscriptionId}`;
    return this.get<GetSubscriptionResponse>(endpoint);
  }

  /**
   * Получить список подписок
   * GET /public/v1/subscription
   *
   * Метод позволяет получить список всех подписок с поддержкой пагинации.
   *
   * @param options - Параметры запроса (continuationToken, pageSize и др.)
   * @returns Список подписок
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription-list
   */
  async getSubscriptionList(
    options?: GetSubscriptionListOptions,
  ): Promise<GetSubscriptionListResponse> {
    const endpoint = '/public/v1/subscription';

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

    return this.get<GetSubscriptionListResponse>(finalEndpoint);
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с платежами
 */
export const paymentsApi = new PaymentsApi();
