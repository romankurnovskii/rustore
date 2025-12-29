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

    it('должен иметь метод createDraftVersion', () => {
      const api = new AppsApi();
      expect(typeof api.createDraftVersion).toBe('function');
    });

    it('должен иметь метод uploadApkFile', () => {
      const api = new AppsApi();
      expect(typeof api.uploadApkFile).toBe('function');
    });

    it('должен иметь метод getVersionInfo', () => {
      const api = new AppsApi();
      expect(typeof api.getVersionInfo).toBe('function');
    });

    it('должен иметь метод getVersionList', () => {
      const api = new AppsApi();
      expect(typeof api.getVersionList).toBe('function');
    });

    it('должен иметь метод getAppTagList', () => {
      const api = new AppsApi();
      expect(typeof api.getAppTagList).toBe('function');
    });

    it('должен иметь метод uploadAabFile', () => {
      const api = new AppsApi();
      expect(typeof api.uploadAabFile).toBe('function');
    });

    it('должен иметь метод updateDraftVersion', () => {
      const api = new AppsApi();
      expect(typeof api.updateDraftVersion).toBe('function');
    });

    it('должен иметь метод deleteDraftVersion', () => {
      const api = new AppsApi();
      expect(typeof api.deleteDraftVersion).toBe('function');
    });

    it('должен иметь метод uploadScreens', () => {
      const api = new AppsApi();
      expect(typeof api.uploadScreens).toBe('function');
    });

    it('должен иметь метод getVersionStatus', () => {
      const api = new AppsApi();
      expect(typeof api.getVersionStatus).toBe('function');
    });
  });

  it('должен проверять доступность endpoint создания черновой версии', async () => {
    // Проверяем, что endpoint отвечает (может вернуть 404, 401, 403 или другой статус)
    // Используем тестовый appId
    const testAppId = 123456;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testAppId}/draft-version`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          versionName: '1.0.0',
          versionCode: 1,
        }),
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен возвращать ошибку без токена при создании черновой версии', async () => {
    const testAppId = 123456;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testAppId}/draft-version`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          versionName: '1.0.0',
          versionCode: 1,
        }),
      },
    );

    // Без авторизации должен вернуть ошибку (401, 403, 404 или другой код ошибки)
    expect(response.status).toBeGreaterThanOrEqual(400);
  }, 10000);

  it('должен проверять доступность endpoint загрузки APK файла', async () => {
    // Проверяем, что endpoint отвечает (может вернуть 404, 401, 403 или другой статус)
    // Используем тестовые appId и versionId
    const testAppId = 123456;
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testAppId}/version/${testVersionId}/apk-file`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Не отправляем реальный файл в тесте, просто проверяем доступность endpoint
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен возвращать ошибку без токена при загрузке APK файла', async () => {
    const testAppId = 123456;
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testAppId}/version/${testVersionId}/apk-file`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    // Без авторизации должен вернуть ошибку (401, 403, 404 или другой код ошибки)
    expect(response.status).toBeGreaterThanOrEqual(400);
  }, 10000);

  it('должен проверять доступность endpoint загрузки AAB файла', async () => {
    const testPackageName = 'com.example.app';
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/version/${testVersionId}/aab`,
      {
        method: 'POST',
      },
    );
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint обновления черновой версии', async () => {
    const testPackageName = 'com.example.app';
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/version/${testVersionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint удаления черновой версии', async () => {
    const testPackageName = 'com.example.app';
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/version/${testVersionId}`,
      {
        method: 'DELETE',
      },
    );
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint загрузки скриншотов', async () => {
    const testPackageName = 'com.example.app';
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/version/${testVersionId}/screens`,
      {
        method: 'POST',
      },
    );
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint получения статуса версии', async () => {
    const testPackageName = 'com.example.app';
    const testVersionId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/version/${testVersionId}/status`,
      {
        method: 'GET',
      },
    );
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);
});
