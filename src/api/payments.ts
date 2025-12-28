/**
 * API для работы с платежами и подписками
 * Категория: Работа с платежами и подписками (общие методы)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions
 */

import {RustoreApiClient} from './client.js';

/**
 * Клиент для работы с платежами (общие методы)
 */
export class PaymentsApi extends RustoreApiClient {
  // Методы будут добавлены по мере необходимости
  // Например: refund, getPaymentById, getSubscription, cancelSubscription и т.д.
}

/**
 * Экспортируемый экземпляр клиента для работы с платежами
 */
export const paymentsApi = new PaymentsApi();
