/**
 * Команды для работы с авторизацией
 */

import {login} from '../api/auth.js';
import {loadConfig, configExists, saveConfig} from '../config.js';

/**
 * Команда входа в систему
 */
export async function loginCommand(keyId: string, privateKey: string): Promise<void> {
  console.log('Получение токена авторизации...');
  await login(keyId, privateKey);
  console.log('✓ Успешно авторизован! Токен сохранён в ~/.rustore/config.json');
}

/**
 * Команда выхода из системы
 */
export function logoutCommand(): void {
  // Просто очищаем токен, но оставляем ключи
  const config = loadConfig();
  delete config.token;
  delete config.tokenExpiresAt;

  saveConfig(config);

  console.log('✓ Выполнен выход из системы. Токен удалён.');
}

/**
 * Команда проверки статуса авторизации
 */
export function whoamiCommand(): void {
  if (!configExists()) {
    console.log('Не авторизован. Используйте "rustore login" для входа.');
    return;
  }

  const config = loadConfig();

  if (!config.keyId) {
    console.log('Конфигурация неполная. Используйте "rustore login" для настройки.');
    return;
  }

  console.log(`Key ID: ${config.keyId}`);
  console.log(`Токен: ${config.token ? 'установлен' : 'не установлен'}`);

  if (config.tokenExpiresAt) {
    const expiresAt = new Date(config.tokenExpiresAt);
    const isValid = config.tokenExpiresAt > Date.now();

    console.log(
      `Срок действия токена: ${expiresAt.toLocaleString('ru-RU')} ${
        isValid ? '(действителен)' : '(истёк)'
      }`,
    );
  }
}
