/**
 * Управление конфигурацией CLI
 * Сохраняет настройки в ~/.rustore/config.json (Linux/Mac) или %USERPROFILE%\.rustore\config.json (Windows)
 * Использует os.homedir() для кроссплатформенной поддержки
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import type {Config} from './types.js';

const CONFIG_DIR = join(homedir(), '.rustore');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

/**
 * Загружает конфигурацию из файла
 */
export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }

  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
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
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, {recursive: true});
    }

    const existingConfig = existsSync(CONFIG_FILE) ? loadConfig() : {};
    const mergedConfig = {...existingConfig, ...config};

    writeFileSync(CONFIG_FILE, JSON.stringify(mergedConfig, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(
      `Ошибка сохранения конфигурации: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Получает путь к директории конфигурации
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}

/**
 * Проверяет, существует ли конфигурация
 */
export function configExists(): boolean {
  return existsSync(CONFIG_FILE);
}
