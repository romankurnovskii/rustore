/**
 * Управление конфигурацией CLI
 * Сохраняет настройки в ~/.rustore/config.json (Linux/Mac) или %USERPROFILE%\.rustore\config.json (Windows)
 * Использует os.homedir() для кроссплатформенной поддержки
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import type {Config} from './types.js';

/**
 * Получает путь к директории конфигурации
 * Позволяет переопределить через переменную окружения RUSTORE_CONFIG_DIR для тестов
 */
function getConfigDirPath(): string {
  return process.env.RUSTORE_CONFIG_DIR || join(homedir(), '.rustore');
}

/**
 * Получает путь к файлу конфигурации
 */
function getConfigFilePath(): string {
  return join(getConfigDirPath(), 'config.json');
}

/**
 * Загружает конфигурацию из файла
 */
export function loadConfig(): Config {
  const configFile = getConfigFilePath();
  if (!existsSync(configFile)) {
    return {};
  }

  try {
    const content = readFileSync(configFile, 'utf-8');
    return JSON.parse(content) as Config;
  } catch (error) {
    throw new Error(
      `Ошибка чтения конфигурации: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Сохраняет конфигурацию в файл
 */
export function saveConfig(config: Config): void {
  try {
    const configDir = getConfigDirPath();
    const configFile = getConfigFilePath();

    if (!existsSync(configDir)) {
      mkdirSync(configDir, {recursive: true});
    }

    const existingConfig = existsSync(configFile) ? loadConfig() : {};
    const mergedConfig = {...existingConfig, ...config};

    writeFileSync(configFile, JSON.stringify(mergedConfig, null, 2), 'utf-8');

    // Проверяем, что файл действительно был сохранен
    if (!existsSync(configFile)) {
      throw new Error(
        `Файл конфигурации не был создан по пути: ${configFile}. Проверьте права доступа.`,
      );
    }

    if (process.env.DEBUG) {
      console.error(`[DEBUG] Config saved to: ${configFile}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const configDir = getConfigDirPath();
    const configFile = getConfigFilePath();
    throw new Error(
      `Ошибка сохранения конфигурации: ${errorMessage}\nПуть: ${configFile}\nДиректория существует: ${existsSync(configDir)}`,
    );
  }
}

/**
 * Получает путь к директории конфигурации
 */
export function getConfigDir(): string {
  return getConfigDirPath();
}

/**
 * Проверяет, существует ли конфигурация
 */
export function configExists(): boolean {
  return existsSync(getConfigFilePath());
}
