/**
 * Тесты для API приложений
 */

import {describe, it, expect} from '@jest/globals';
import {AppsApi} from '../src/api/apps.js';

describe('Apps API', () => {
  const API_BASE_URL = 'https://public-api.rustore.ru';

  it('должен проверять доступность endpoint получения списка приложений', async () => {
    // Проверяем, что endpoint отвечает (может вернуть 404, 401, 403 или другой статус)
    const response = await fetch(`${API_BASE_URL}/public/applications/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен возвращать ошибку без токена', async () => {
    const response = await fetch(`${API_BASE_URL}/public/applications/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Без авторизации должен вернуть ошибку (401, 403, 404 или другой код ошибки)
    expect(response.status).toBeGreaterThanOrEqual(400);
  }, 10000);

  describe('AppsApi класс', () => {
    it('должен создавать экземпляр', () => {
      const api = new AppsApi();
      expect(api).toBeInstanceOf(AppsApi);
    });

    it('должен иметь метод getAppList', () => {
      const api = new AppsApi();
      expect(typeof api.getAppList).toBe('function');
    });

    it('должен иметь метод getAllApps', () => {
      const api = new AppsApi();
      expect(typeof api.getAllApps).toBe('function');
    });
  });
});
