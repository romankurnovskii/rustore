/**
 * API для работы с платежами и подписками (методы приложений)
 * Категория: Работа с платежами и подписками (методы приложений)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app
 */

import {RustoreApiClient} from './client.js';

/**
 * Клиент для работы с платежами (методы приложений)
 */
export class PaymentsAppApi extends RustoreApiClient {
  // Методы будут добавлены по мере необходимости
  // Например: getInvoices, confirmPurchase, cancelPurchase и т.д.
}

/**
 * Экспортируемый экземпляр клиента для работы с платежами приложений
 */
export const paymentsAppApi = new PaymentsAppApi();
