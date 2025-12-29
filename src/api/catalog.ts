/**
 * API для работы с продуктовым каталогом
 * Категория: API для работы с продуктовым каталогом
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog
 */

import {RustoreApiClient} from './client.js';
import type {
  GetProductsResponse,
  GetProductsOptions,
  GetProductResponse,
} from '../types.js';

/**
 * Клиент для работы с продуктовым каталогом
 */
export class CatalogApi extends RustoreApiClient {
  /**
   * Получить список продуктов
   * GET /public/v1/catalog/product
   *
   * Метод позволяет получить список всех продуктов с поддержкой пагинации.
   *
   * @param options - Параметры запроса (continuationToken, pageSize и др.)
   * @returns Список продуктов
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog/get-products
   */
  async getProducts(options?: GetProductsOptions): Promise<GetProductsResponse> {
    const endpoint = '/public/v1/catalog/product';

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

    return this.get<GetProductsResponse>(finalEndpoint);
  }

  /**
   * Получить информацию о продукте
   * GET /public/v1/catalog/product/{productId}
   *
   * Метод позволяет получить детальную информацию о конкретном продукте.
   *
   * @param productId - ID продукта
   * @returns Информация о продукте
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog/get-product
   */
  async getProduct(productId: number): Promise<GetProductResponse> {
    const endpoint = `/public/v1/catalog/product/${productId}`;
    return this.get<GetProductResponse>(endpoint);
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с каталогом
 */
export const catalogApi = new CatalogApi();
