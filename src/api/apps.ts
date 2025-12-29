/**
 * API для работы с приложениями
 * Категория: Загрузка и публикация приложений (общие методы)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app
 */

import {readFileSync, existsSync, statSync} from 'node:fs';
import {RustoreApiClient} from './client.js';
import {getToken} from './auth.js';
import type {
  GetAppListResponse,
  App,
  GetAppListOptions,
  CreateDraftVersionRequest,
  CreateDraftVersionResponse,
  UploadApkFileResponse,
  UploadApkFileOptions,
  SendForModerationResponse,
  SendForModerationOptions,
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
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-list
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
   *
   * Вспомогательный метод, который автоматически обрабатывает пагинацию
   * и возвращает все приложения из всех страниц.
   *
   * @param options - Параметры запроса (pageSize, appName и др., кроме continuationToken)
   * @returns Массив всех приложений
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-list
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
   * POST /public/v1/application/{packageName}/version
   *
   * Метод позволяет создать черновик версии и заполнить его основной информацией.
   * Обязательный параметр: minAndroidVersion (от 1 до 16).
   *
   * @param packageName - Наименование пакета приложения (например, com.example.app)
   * @param data - Данные для создания черновой версии
   * @returns Информация о созданной черновой версии
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version
   */
  async createDraftVersion(
    packageName: string,
    data: CreateDraftVersionRequest,
  ): Promise<CreateDraftVersionResponse> {
    const endpoint = `/public/v1/application/${packageName}/version`;
    return this.post<CreateDraftVersionResponse>(endpoint, data);
  }

  /**
   * Загрузить APK файл для версии приложения
   * POST /public/v1/application/{packageName}/version/{versionId}/apk
   *
   * Метод позволяет загрузить APK файл для версии приложения.
   * Согласно документации API, endpoint использует packageName, а не appId.
   *
   * @param packageName - Имя пакета приложения (например, com.example.app)
   * @param versionId - ID версии (полученный из createDraftVersion)
   * @param filePath - Путь к APK файлу
   * @param options - Параметры загрузки (isMainApk - обязательный, servicesType - опциональный)
   * @returns Информация о загруженном файле
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/apk-file-upload/file-upload-apk
   */
  async uploadApkFile(
    packageName: string,
    versionId: number,
    filePath: string,
    options: UploadApkFileOptions,
  ): Promise<UploadApkFileResponse> {
    // Формируем query параметры
    const queryParams = new URLSearchParams();
    queryParams.append('isMainApk', String(options.isMainApk));
    if (options.servicesType) {
      queryParams.append('servicesType', options.servicesType);
    } else {
      queryParams.append('servicesType', 'Unknown');
    }

    const endpoint = `/public/v1/application/${packageName}/version/${versionId}/apk?${queryParams.toString()}`;

    // Читаем файл
    const fileBuffer = readFileSync(filePath);
    const fileName = filePath.split('/').pop() || 'app.apk';

    // Создаём FormData для multipart/form-data запроса
    // В Node.js 18+ FormData поддерживается нативно
    const formData = new FormData();
    // Используем File вместо Blob для лучшей совместимости
    const file = new File([fileBuffer], fileName, {
      type: 'application/vnd.android.package-archive',
    });
    formData.append('file', file);

    // Выполняем запрос с FormData
    const token = await getToken();
    const url = `${this.baseUrl}${endpoint}`;

    if (process.env.DEBUG) {
      const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
      console.error(
        `[DEBUG] API Request: ${url} (uploading ${fileName}, size: ${fileSizeMB} MB)`,
      );
    }

    // Проверяем, что файл существует и доступен для чтения
    if (!existsSync(filePath)) {
      throw new Error(`Файл не найден: ${filePath}`);
    }

    const fileStats = statSync(filePath);
    if (process.env.DEBUG) {
      console.error(
        `[DEBUG] File size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`,
      );
      console.error(`[DEBUG] File readable: ${fileStats.mode & 0o444 ? 'yes' : 'no'}`);
    }

    // Для больших файлов может потребоваться больше времени
    // Используем AbortController с увеличенным таймаутом (30 минут для файлов до 5 ГБ)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30 * 60 * 1000); // 30 минут

    let response: Response;
    try {
      if (process.env.DEBUG) {
        console.error(`[DEBUG] Starting fetch request to: ${url}`);
        console.error(
          `[DEBUG] FormData entries count: ${formData instanceof FormData ? 'N/A (FormData)' : '0'}`,
        );
      }

      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Public-Token': token,
          // Не устанавливаем Content-Type - fetch установит автоматически с boundary
        },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (process.env.DEBUG) {
        console.error(`[DEBUG] Fetch error details:`, {
          name: fetchError instanceof Error ? fetchError.name : 'Unknown',
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
          cause: fetchError instanceof Error ? fetchError.cause : undefined,
        });
      }

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error(
          'Таймаут загрузки файла. Файл слишком большой или соединение прервано.',
        );
      }

      // Более детальная информация об ошибке
      const errorMessage =
        fetchError instanceof Error ? fetchError.message : String(fetchError);
      const errorName = fetchError instanceof Error ? fetchError.name : 'UnknownError';

      // Проверяем, является ли это сетевой ошибкой
      if (errorName === 'TypeError' && errorMessage.includes('fetch failed')) {
        throw new Error(
          `Ошибка сетевого соединения при загрузке файла.\n` +
            `Детали: ${errorMessage}\n` +
            `URL: ${url}\n` +
            `Размер файла: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB\n` +
            `Проверьте:\n` +
            `  1. Интернет-соединение\n` +
            `  2. Доступность API (https://public-api.rustore.ru)\n` +
            `  3. Размер файла (максимальный размер может быть ограничен)\n` +
            `  4. Токен авторизации (выполните 'rustore login' если необходимо)`,
        );
      }

      throw new Error(`Ошибка загрузки файла (${errorName}): ${errorMessage}`);
    }

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
      let errorData: {code?: string; message?: string} | undefined;

      try {
        errorData = JSON.parse(responseText);
      } catch {
        // Игнорируем ошибку парсинга
      }

      const errorMessage = errorData?.message ?? responseText;
      throw new Error(`Ошибка API (${response.status}): ${errorMessage}`);
    }

    // Парсим JSON ответ
    try {
      return JSON.parse(responseText) as UploadApkFileResponse;
    } catch (parseError) {
      if (process.env.DEBUG) {
        console.error(`[DEBUG] Failed to parse JSON response:`, parseError);
      }
      throw new Error(`Ошибка парсинга ответа API: ${responseText}`);
    }
  }

  /**
   * Отправить черновую версию приложения на модерацию
   * POST /public/v1/application/{packageName}/version/{versionId}/commit
   *
   * Метод для отправки на модерацию черновика версии приложения.
   * Перед отправкой убедитесь, что загружен хотя бы один основной APK-файл.
   *
   * @param packageName - Имя пакета приложения (например, com.example.app)
   * @param versionId - ID версии (полученный из createDraftVersion)
   * @param options - Параметры отправки (priorityUpdate - опциональный, от 0 до 5)
   * @returns Информация об отправке на модерацию
   *
   * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/send-draft-app-for-moderation
   */
  async sendForModeration(
    packageName: string,
    versionId: number,
    options?: SendForModerationOptions,
  ): Promise<SendForModerationResponse> {
    const queryParams = new URLSearchParams();
    if (options?.priorityUpdate !== undefined) {
      queryParams.append('priorityUpdate', String(options.priorityUpdate));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/public/v1/application/${packageName}/version/${versionId}/commit?${queryString}`
      : `/public/v1/application/${packageName}/version/${versionId}/commit`;

    return this.post<SendForModerationResponse>(endpoint);
  }
}

/**
 * Экспортируемый экземпляр клиента для работы с приложениями
 */
export const appsApi = new AppsApi();
