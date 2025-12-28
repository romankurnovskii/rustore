/**
 * API для работы с приложениями
 * Категория: Загрузка и публикация приложений (общие методы)
 */

import {readFileSync} from 'node:fs';
import {RustoreApiClient} from './client.js';
import {getToken} from './auth.js';
import type {
  GetAppListResponse,
  App,
  GetAppListOptions,
  CreateDraftVersionRequest,
  CreateDraftVersionResponse,
  UploadApkFileResponse,
} from '../types.js';

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

  /**
   * Создать черновую версию приложения
   * POST /public/v1/application/{appId}/draft-version
   *
   * Метод позволяет создать черновую версию приложения для последующей загрузки APK/AAB.
   *
   * @param appId - ID приложения
   * @param data - Данные для создания черновой версии (versionName, versionCode)
   * @returns Информация о созданной черновой версии
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version
   */
  async createDraftVersion(
    appId: number,
    data: CreateDraftVersionRequest,
  ): Promise<CreateDraftVersionResponse> {
    const endpoint = `/public/v1/application/${appId}/draft-version`;
    return this.post<CreateDraftVersionResponse>(endpoint, data);
  }

  /**
   * Загрузить APK/AAB файл для версии приложения
   * POST /public/v1/application/{appId}/version/{versionId}/apk-file
   *
   * Метод позволяет загрузить APK или AAB файл для черновой версии приложения.
   *
   * @param appId - ID приложения
   * @param versionId - ID версии (полученный из createDraftVersion)
   * @param filePath - Путь к APK/AAB файлу
   * @returns Информация о загруженном файле
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/apk-file-upload
   */
  async uploadApkFile(
    appId: number,
    versionId: number,
    filePath: string,
  ): Promise<UploadApkFileResponse> {
    const endpoint = `/public/v1/application/${appId}/version/${versionId}/apk-file`;

    // Читаем файл
    const fileBuffer = readFileSync(filePath);
    const fileName = filePath.split('/').pop() || 'app.apk';

    // Создаём FormData для multipart/form-data запроса
    const formData = new FormData();
    const blob = new Blob([fileBuffer], {
      type: 'application/vnd.android.package-archive',
    });
    formData.append('file', blob, fileName);

    // Выполняем запрос с FormData
    const token = await getToken();
    const url = `${this.baseUrl}${endpoint}`;

    if (process.env.DEBUG) {
      console.error(`[DEBUG] API Request: ${url} (uploading ${fileName})`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Public-Token': token,
        // Не устанавливаем Content-Type - браузер установит автоматически с boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData: {code?: string; message?: string} | undefined;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        // Игнорируем ошибку парсинга
      }

      const errorMessage = errorData?.message ?? errorText;
      throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
    }

    return (await response.json()) as UploadApkFileResponse;
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с приложениями
 */
export const appsApi = new AppsApi();
