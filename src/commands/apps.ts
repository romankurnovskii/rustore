/**
 * Команды для работы с приложениями
 */

import {appsApi} from '../api/apps.js';
import type {App, CreateDraftVersionRequest} from '../types.js';

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

      if (response.body.continuationToken) {
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
    console.log('');
  });
}

/**
 * Команда создания черновой версии приложения
 */
export async function createDraftVersionCommand(
  appId: number,
  versionName: string,
  versionCode: number,
  json: boolean = false,
): Promise<void> {
  try {
    const data: CreateDraftVersionRequest = {
      versionName,
      versionCode,
    };

    const response = await appsApi.createDraftVersion(appId, data);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Черновая версия успешно создана!');
      if (response.body) {
        console.log(`   ID версии: ${response.body.versionId || 'N/A'}`);
        console.log(`   Имя версии: ${response.body.versionName || versionName}`);
        console.log(`   Код версии: ${response.body.versionCode || versionCode}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка создания черновой версии: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда загрузки APK/AAB файла
 */
export async function uploadApkFileCommand(
  appId: number,
  versionId: number,
  filePath: string,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await appsApi.uploadApkFile(appId, versionId, filePath);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ APK/AAB файл успешно загружен!');
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
