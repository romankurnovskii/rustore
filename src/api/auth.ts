/**
 * Модуль для работы с авторизацией RuStore API
 */

import {createSign} from 'node:crypto';
import type {AuthRequest, AuthTokenResponse, Config} from '../types.js';
import {loadConfig, saveConfig} from '../config.js';

const API_BASE_URL = 'https://public-api.rustore.ru';

/**
 * Генерирует RSA-SHA512 подпись для запроса авторизации
 */
export function generateSignature(
  keyId: string,
  timestamp: string,
  privateKey: string,
): string {
  try {
    // Приватный ключ может быть в Base64 или уже в PEM формате
    // Пытаемся определить формат
    let privateKeyPEM: string;

    // Если ключ не содержит заголовков PEM, значит это Base64
    if (!privateKey.includes('-----BEGIN')) {
      // Декодируем приватный ключ из Base64
      const privateKeyBuffer = Buffer.from(privateKey, 'base64');
      privateKeyPEM = privateKeyBuffer.toString('utf-8');

      // Если после декодирования всё ещё нет заголовков, возможно это DER формат
      // В Node.js crypto может работать с DER, но попробуем сначала как PEM
      if (!privateKeyPEM.includes('-----BEGIN')) {
        // Пытаемся использовать как DER (raw binary)
        privateKeyPEM = privateKey;
      }
    } else {
      // Ключ уже в PEM формате
      privateKeyPEM = privateKey;
    }

    // Создаём сообщение для подписи: keyId + timestamp
    const message = keyId + timestamp;

    // Создаём подпись
    const sign = createSign('RSA-SHA512');
    sign.update(message, 'utf-8');
    sign.end();

    // Пытаемся использовать ключ как PEM, если не получится - как DER
    try {
      return sign.sign(privateKeyPEM, 'base64');
    } catch {
      // Если не получилось с PEM, пробуем с raw buffer в DER формате
      const keyBuffer = Buffer.from(privateKey, 'base64');
      return sign.sign({key: keyBuffer, format: 'der', type: 'pkcs1'}, 'base64');
    }
  } catch (error) {
    throw new Error(
      `Ошибка генерации подписи: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Формирует запрос для получения токена авторизации
 */
export function createAuthRequest(keyId: string, privateKey: string): AuthRequest {
  // Генерируем timestamp в формате ISO 8601 с миллисекундами
  const now = new Date();
  const timestamp = now.toISOString().replace('Z', '+00:00');

  const signature = generateSignature(keyId, timestamp, privateKey);

  return {
    keyId,
    timestamp,
    signature,
  };
}

/**
 * Получает токен авторизации от RuStore API
 */
export async function getAuthToken(
  keyId: string,
  privateKey: string,
): Promise<AuthTokenResponse> {
  const authRequest = createAuthRequest(keyId, privateKey);

  const response = await fetch(`${API_BASE_URL}/public/auth/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ошибка получения токена: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as AuthTokenResponse;

  if (data.code !== 'OK' && data.code !== 'ok') {
    throw new Error(`Ошибка API: ${data.message ?? 'Неизвестная ошибка'}`);
  }

  return data;
}

/**
 * Сохраняет токен в конфигурацию
 */
export async function login(keyId: string, privateKey: string): Promise<void> {
  const tokenResponse = await getAuthToken(keyId, privateKey);

  if (!tokenResponse.body?.jwe) {
    throw new Error('Токен не получен в ответе API');
  }

  const config: Config = {
    keyId,
    privateKey,
    token: tokenResponse.body.jwe,
    tokenExpiresAt: Date.now() + tokenResponse.body.ttl * 1000,
  };

  saveConfig(config);
}

/**
 * Проверяет, действителен ли сохранённый токен
 */
export function isTokenValid(): boolean {
  const config = loadConfig();
  if (!config.token || !config.tokenExpiresAt) {
    return false;
  }

  // Проверяем, не истёк ли токен (с запасом в 60 секунд)
  return config.tokenExpiresAt > Date.now() + 60000;
}

/**
 * Получает токен из конфигурации или обновляет его
 */
export async function getToken(): Promise<string> {
  const config = loadConfig();

  if (!config.keyId || !config.privateKey) {
    throw new Error(
      'Ключи не настроены. Используйте команду "rustore login" для настройки.',
    );
  }

  // Если токен валиден, возвращаем его
  if (isTokenValid() && config.token) {
    return config.token;
  }

  // Иначе обновляем токен
  const tokenResponse = await getAuthToken(config.keyId, config.privateKey);

  if (!tokenResponse.body?.jwe) {
    throw new Error('Токен не получен в ответе API');
  }

  const updatedConfig: Config = {
    ...config,
    token: tokenResponse.body.jwe,
    tokenExpiresAt: Date.now() + tokenResponse.body.ttl * 1000,
  };

  saveConfig(updatedConfig);

  return tokenResponse.body.jwe;
}
