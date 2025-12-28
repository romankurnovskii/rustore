/**
 * API для работы с приложениями
 * Категория: Загрузка и публикация приложений (общие методы)
 */

import {RustoreApiClient} from './client.js';
import type {GetAppListResponse, App, GetAppListOptions} from '../types.js';

/**
 * Клиент для работы с приложениями
 */
export class AppsApi extends RustoreApiClient {
  /**
   * Получить список приложений
   * GET /public/v1/application
   *
   * Метод позволяет получить приложения, доступные владельцу аккаунта,
   * для которого создан приватный ключ.
   *
   * @param options - Параметры запроса (continuationToken, pageSize, appName и др.)
   * @returns Список приложений
   */
  async getAppList(options?: GetAppListOptions): Promise<GetAppListResponse> {
    // Проверяем, не указан ли endpoint вручную через переменную окружения
    const customEndpoint = process.env.RUSTORE_APPLICATIONS_ENDPOINT;
    const baseEndpoint = customEndpoint || '/public/v1/application';

    // Формируем query параметры
    const queryParams = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Boolean значения конвертируем в строки "true"/"false"
          // TODO: Фильтр по paid может не работать корректно
          // При использовании paid=false API может возвращать пустой результат
          // или игнорировать параметр. Требуется проверка документации:
          // https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-list
          // Возможно, API требует другой формат (0/1) или не поддерживает фильтрацию по false
          const stringValue = typeof value === 'boolean' ? String(value) : String(value);
          queryParams.append(key, stringValue);
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;

    return this.get<GetAppListResponse>(endpoint);
  }

  /**
   * Получить все приложения (с автоматической пагинацией)
   * @param options - Параметры запроса (pageSize, appName и др., кроме continuationToken)
   * @returns Массив всех приложений
   */
  async getAllApps(
    options?: Omit<GetAppListOptions, 'continuationToken'>,
  ): Promise<App[]> {
    const allApps: App[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.getAppList({...options, continuationToken});
      allApps.push(...response.body.content);

      continuationToken = response.body.continuationToken;
    } while (continuationToken);

    return allApps;
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с приложениями
 */
export const appsApi = new AppsApi();
