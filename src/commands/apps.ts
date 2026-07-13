/**
 * Команды для работы с приложениями
 */

import {appsApi} from '../api/apps.js';
import type {
  App,
  CreateDraftVersionRequest,
  UpdateDraftVersionRequest,
} from '../types.js';

/**
 * Команда получения списка приложений
 */
export async function listAppsCommand(options: {
  all?: boolean;
  json?: boolean;
  pageSize?: number;
  appName?: string;
  packageName?: string;
  appStatus?: string;
  [key: string]: string | number | boolean | undefined;
}): Promise<void> {
  try {
    // Извлекаем API параметры из options
    // Конвертируем kebab-case CLI опции в camelCase для API
    const apiOptions: {
      pageSize?: number;
      appName?: string;
      packageName?: string;
      appStatus?: string;
      paid?: boolean;
      [key: string]: string | number | boolean | undefined;
    } = {};

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        // Конвертируем kebab-case в camelCase для соответствия API
        const apiKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        apiOptions[apiKey] = value as string | number | boolean;
      }
    });

    if (options.all) {
      const apps = await appsApi.getAllApps(apiOptions);
      outputApps(apps, options.json);
    } else {
      const response = await appsApi.getAppList(apiOptions);
      outputApps(response.body.content, options.json);

      if (response?.body?.continuationToken) {
        console.log(
          `\n⚠️  Есть ещё приложения. Используйте --all для получения полного списка.`,
        );
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка приложений: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Выводит список приложений в консоль
 */
function outputApps(apps: App[], json: boolean = false): void {
  if (json) {
    console.log(JSON.stringify(apps, null, 2));
    return;
  }

  if (apps.length === 0) {
    console.log('Приложения не найдены.');
    return;
  }

  console.log(`\nНайдено приложений: ${apps.length}\n`);

  apps.forEach((app, index) => {
    console.log(`${index + 1}. ${app.appName}`);
    console.log(`   Package: ${app.packageName}`);
    console.log(`   ID: ${app.appId}`);
    console.log(`   Статус: ${app.appStatus}`);
    console.log(`   Версия: ${app.versionName} (${app.versionCode})`);
    if (app.versionType) {
      console.log(`   Тип версии: ${app.versionType}`);
    }
    console.log(
      `   Компания: ${app.companyName}${app.companyId ? ` (ID: ${app.companyId})` : ''}`,
    );
    if (app.role) {
      console.log(`   Роль: ${app.role}`);
    }
    console.log(`   Устройство: ${app.deviceType}`);
    console.log(
      `   Цена: ${app.activePrice > 0 ? `${app.activePrice} ₽` : 'Бесплатно'} (paid: ${app.paid})`,
    );
    console.log(`   Обновлено: ${new Date(app.appVerUpdatedAt).toLocaleString('ru-RU')}`);
    if (app.shortDescription) {
      console.log(`   Описание: ${app.shortDescription}`);
    }
    if (app.iconUrl) {
      console.log(`   Иконка: ${app.iconUrl}`);
    }
    // Выводим все дополнительные поля из API ответа
    Object.entries(app).forEach(([key, value]) => {
      const knownKeys = [
        'appName',
        'packageName',
        'appId',
        'appStatus',
        'versionName',
        'versionCode',
        'versionType',
        'companyName',
        'companyId',
        'role',
        'deviceType',
        'activePrice',
        'paid',
        'appVerUpdatedAt',
        'shortDescription',
        'iconUrl',
      ];
      if (!knownKeys.includes(key) && value !== undefined && value !== null) {
        console.log(`   ${key}: ${JSON.stringify(value)}`);
      }
    });
    console.log('');
  });
}

/**
 * Команда создания черновой версии приложения
 *
 * Создает черновую версию приложения для последующей загрузки APK/AAB файла.
 * Обязательный параметр: minAndroidVersion (от 1 до 16).
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param data - Данные для создания черновой версии
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version
 */
export async function createDraftVersionCommand(
  packageName: string,
  data: CreateDraftVersionRequest,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.createDraftVersion(packageName, data);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Черновая версия успешно создана!');
      if (response.body !== undefined && response.body !== null) {
        // API возвращает versionId напрямую как число в поле body
        // Пример: {"code":"OK","body":2064432562,"timestamp":"..."}
        let versionId: number | undefined;

        if (typeof response.body === 'number') {
          // body - это сам versionId (число)
          versionId = response.body;
        } else if (typeof response.body === 'object') {
          // body - это объект, пытаемся найти versionId в разных возможных полях
          versionId =
            response.body.versionId ||
            (response.body as {id?: number}).id ||
            (response.body as {version_id?: number}).version_id;

          // Выводим все доступные поля из объекта body
          Object.entries(response.body).forEach(([key, value]) => {
            if (
              key !== 'versionId' &&
              key !== 'id' &&
              key !== 'version_id' &&
              value !== undefined &&
              value !== null
            ) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        }

        if (versionId) {
          console.log(`   ID версии: ${versionId}`);
        } else {
          console.log(`   ID версии: N/A`);
        }
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Пытаемся извлечь versionId из сообщения об ошибке, если версия уже существует
    const versionIdMatch = errorMessage.match(/ID\s*=\s*(\d+)/i);
    if (versionIdMatch) {
      const existingVersionId = versionIdMatch[1];
      throw new Error(
        `${errorMessage}\n\n💡 У вас уже есть черновая версия с ID: ${existingVersionId}\n   Используйте этот ID для загрузки APK файла.`,
      );
    }
    throw new Error(`Ошибка создания черновой версии: ${errorMessage}`);
  }
}

/**
 * Команда отправки черновой версии на модерацию
 *
 * Отправляет черновую версию приложения на модерацию после загрузки APK файла.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param versionId - ID версии (полученный из createDraftVersion)
 * @param priorityUpdate - Приоритет обновления (опциональный, от 0 до 5)
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/send-draft-app-for-moderation
 */
export async function sendForModerationCommand(
  packageName: string,
  versionId: number,
  priorityUpdate?: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.sendForModeration(packageName, versionId, {
      priorityUpdate,
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Черновая версия успешно отправлена на модерацию!');
      console.log('   Приложение будет проверено модераторами RuStore.');
      if (priorityUpdate !== undefined) {
        console.log(`   Приоритет обновления: ${priorityUpdate}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка отправки на модерацию: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда загрузки APK файла
 */
export async function uploadApkFileCommand(
  packageName: string,
  versionId: number,
  filePath: string,
  isMainApk: boolean,
  servicesType?: 'HMS' | 'Unknown',
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.uploadApkFile(packageName, versionId, filePath, {
      isMainApk,
      servicesType: servicesType || 'Unknown',
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ APK файл успешно загружен!');
      if (response.body) {
        console.log(`   ID файла: ${response.body.fileId || 'N/A'}`);
        console.log(`   Имя файла: ${response.body.fileName || 'N/A'}`);
        if (response.body.fileSize) {
          const sizeMB = (response.body.fileSize / (1024 * 1024)).toFixed(2);
          console.log(`   Размер: ${sizeMB} MB`);
        }
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка загрузки APK файла: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения информации о версии приложения
 *
 * Получает детальную информацию о конкретной версии приложения.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param versionId - ID версии
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-version-info
 */
export async function getVersionInfoCommand(
  packageName: string,
  versionId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.getVersionInfo(packageName, versionId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Информация о версии:');
      if (response.body) {
        Object.entries(response.body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        });
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения информации о версии: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения списка версий приложения
 *
 * Получает список всех версий приложения с поддержкой пагинации.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-version-list
 */
export async function getVersionListCommand(
  packageName: string,
  options: {
    all?: boolean;
    json?: boolean;
    pageSize?: number;
    continuationToken?: string;
    [key: string]: string | number | boolean | undefined;
  },
): Promise<void> {
  try {
    // Извлекаем API параметры из options
    const apiOptions: {
      pageSize?: number;
      continuationToken?: string;
      [key: string]: string | number | undefined;
    } = {};

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все версии с пагинацией
      const allVersions: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await appsApi.getVersionList(packageName, {
          ...apiOptions,
          continuationToken,
        });
        allVersions.push(...response.body.content);
        continuationToken = response?.body?.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(JSON.stringify({code: 'OK', body: {content: allVersions}}, null, 2));
      } else {
        console.log(`✅ Найдено версий: ${allVersions.length}`);
        allVersions.forEach((version, index) => {
          console.log(`\nВерсия ${index + 1}:`);
          Object.entries(version as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        });
      }
    } else {
      const response = await appsApi.getVersionList(packageName, apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено версий: ${(response?.body?.content ?? []).length}`);
          (response?.body?.content ?? []).forEach((version, index) => {
            console.log(`\nВерсия ${index + 1}:`);
            Object.entries(version).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response?.body?.continuationToken) {
            console.log(
              `\n💡 Есть ещё версии. Используйте --all для получения всех версий.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка версий: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения списка тегов приложений
 *
 * Получает список доступных тегов для приложений.
 * Теги используются при создании черновой версии (seoTagIds).
 *
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-tag-list
 */
export async function getAppTagListCommand(options: {
  all?: boolean;
  json?: boolean;
  pageSize?: number;
  continuationToken?: string;
  [key: string]: string | number | boolean | undefined;
}): Promise<void> {
  try {
    // Извлекаем API параметры из options
    const apiOptions: {
      pageSize?: number;
      continuationToken?: string;
      [key: string]: string | number | undefined;
    } = {};

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все теги с пагинацией
      const allTags: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await appsApi.getAppTagList({
          ...apiOptions,
          continuationToken,
        });
        allTags.push(...response.body.content);
        continuationToken = response?.body?.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(JSON.stringify({code: 'OK', body: {content: allTags}}, null, 2));
      } else {
        console.log(`✅ Найдено тегов: ${allTags.length}`);
        allTags.forEach((tag, index) => {
          console.log(`\nТег ${index + 1}:`);
          Object.entries(tag as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        });
      }
    } else {
      const response = await appsApi.getAppTagList(apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено тегов: ${(response?.body?.content ?? []).length}`);
          (response?.body?.content ?? []).forEach((tag, index) => {
            console.log(`\nТег ${index + 1}:`);
            Object.entries(tag).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response?.body?.continuationToken) {
            console.log(
              `\n💡 Есть ещё теги. Используйте --all для получения всех тегов.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка тегов: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда загрузки AAB файла
 */
export async function uploadAabFileCommand(
  packageName: string,
  versionId: number,
  filePath: string,
  isMainApk: boolean,
  servicesType?: 'HMS' | 'Unknown',
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.uploadAabFile(packageName, versionId, filePath, {
      isMainApk,
      servicesType: servicesType || 'Unknown',
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ AAB файл успешно загружен!');
      if (response.body) {
        console.log(`   ID файла: ${response.body.fileId || 'N/A'}`);
        console.log(`   Имя файла: ${response.body.fileName || 'N/A'}`);
        if (response.body.fileSize) {
          const sizeMB = (response.body.fileSize / (1024 * 1024)).toFixed(2);
          console.log(`   Размер: ${sizeMB} MB`);
        }
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка загрузки AAB файла: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда обновления черновой версии приложения
 */
export async function updateDraftVersionCommand(
  packageName: string,
  versionId: number,
  data: UpdateDraftVersionRequest,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.updateDraftVersion(packageName, versionId, data);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Черновая версия успешно обновлена!');
      if (response.body?.versionId) {
        console.log(`   ID версии: ${response.body.versionId}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка обновления черновой версии: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда удаления черновой версии приложения
 */
export async function deleteDraftVersionCommand(
  packageName: string,
  versionId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.deleteDraftVersion(packageName, versionId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Черновая версия успешно удалена!');
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка удаления черновой версии: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда загрузки скриншотов для версии приложения
 */
export async function uploadScreensCommand(
  packageName: string,
  versionId: number,
  filePaths: string[],
  deviceType: 'PHONE' | 'TABLET' | 'TV',
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.uploadScreens(packageName, versionId, filePaths, {
      deviceType,
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Скриншоты успешно загружены!');
      if (response.body?.screenIds) {
        console.log(`   Загружено скриншотов: ${response.body.screenIds.length}`);
        console.log(`   Тип устройства: ${deviceType}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка загрузки скриншотов: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения статуса версии приложения
 */
export async function getVersionStatusCommand(
  packageName: string,
  versionId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.getVersionStatus(packageName, versionId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Статус версии приложения:');
      if (response.body) {
        Object.entries(response.body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        });
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения статуса версии: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
