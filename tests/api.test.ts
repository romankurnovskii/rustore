/**
 * Тесты для API клиента
 * Проверяем доступность endpoints без авторизации
 */

import {describe, it, expect} from '@jest/globals';

describe('API Endpoints', () => {
  const API_BASE_URL = 'https://public-api.rustore.ru';

  it('должен быть доступен endpoint авторизации', async () => {
    // Проверяем, что endpoint существует (может вернуть ошибку, но не 404)
    const response = await fetch(`${API_BASE_URL}/public/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyId: 'test',
        timestamp: new Date().toISOString(),
        signature: 'test',
      }),
    });

    // Endpoint должен существовать (не 404)
    expect(response.status).not.toBe(404);

    // Должен вернуть JSON ответ
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  }, 10000); // Увеличиваем таймаут для сетевых запросов

  it('должен возвращать ошибку для невалидных данных авторизации', async () => {
    const response = await fetch(`${API_BASE_URL}/public/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyId: 'invalid',
        timestamp: new Date().toISOString(),
        signature: 'invalid',
      }),
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThan(500);

    const data = (await response.json()) as {code: string; message?: string};
    expect(data).toHaveProperty('code');
    // Код должен быть 'error' для невалидных данных
    expect(['error', 'ERROR', 'Error']).toContain(data.code);
  }, 10000);
});
