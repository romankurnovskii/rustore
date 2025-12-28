/**
 * API для работы с продуктовым каталогом
 * Категория: API для работы с продуктовым каталогом
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog
 */

import {RustoreApiClient} from './client.js';

/**
 * Клиент для работы с продуктовым каталогом
 */
export class CatalogApi extends RustoreApiClient {
  // Методы будут добавлены по мере необходимости
  // Например: getProducts, getSubscriptions и т.д.
}

/**
 * Экспортируемый экземпляр клиента для работы с каталогом
 */
export const catalogApi = new CatalogApi();
