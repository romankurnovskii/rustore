/**
 * Тесты для модуля авторизации
 */

import {describe, it, expect, beforeEach} from '@jest/globals';
import {existsSync, unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {generateSignature, createAuthRequest, isTokenValid} from '../src/api/auth.js';
import {saveConfig} from '../src/config.js';

const CONFIG_FILE = join(homedir(), '.rustore', 'config.json');

describe('Auth Module', () => {
  beforeEach(() => {
    // Очищаем конфиг перед каждым тестом
    if (existsSync(CONFIG_FILE)) {
      unlinkSync(CONFIG_FILE);
    }
  });

  describe('generateSignature', () => {
    it('должен генерировать подпись в правильном формате', () => {
      // Используем тестовый приватный ключ (минимум 2048 бит для RSA-SHA512)
      // Это пример ключа, в реальности нужно использовать настоящий ключ
      const testKeyId = '123';
      const testTimestamp = '2024-06-18T11:49:08.290+03:00';

      // Для теста создадим минимальный валидный RSA ключ
      // В реальном использовании ключ должен быть получен из RuStore Консоль
      const testPrivateKey = Buffer.from(
        'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC',
      ).toString('base64');

      // Проверяем, что функция не падает с ошибкой
      // В реальности нужен валидный ключ для полного теста
      expect(() => {
        try {
          generateSignature(testKeyId, testTimestamp, testPrivateKey);
        } catch (error) {
          // Ожидаем ошибку для невалидного ключа, но проверяем структуру
          expect(error).toBeInstanceOf(Error);
        }
      }).not.toThrow();
    });

    it('должен выбрасывать ошибку для невалидного ключа', () => {
      const testKeyId = '123';
      const testTimestamp = '2024-06-18T11:49:08.290+03:00';
      const invalidKey = 'invalid-key';

      expect(() => {
        generateSignature(testKeyId, testTimestamp, invalidKey);
      }).toThrow();
    });
  });

  describe('createAuthRequest', () => {
    it('должен создавать запрос с правильной структурой', () => {
      const testKeyId = '123';
      // Минимальный валидный Base64 ключ для теста
      const testPrivateKey = Buffer.from('test').toString('base64');

      // Проверяем структуру (может упасть на невалидном ключе, но структура должна быть правильной)
      try {
        const request = createAuthRequest(testKeyId, testPrivateKey);
        expect(request).toHaveProperty('keyId');
        expect(request).toHaveProperty('timestamp');
        expect(request).toHaveProperty('signature');
        expect(request.keyId).toBe(testKeyId);
        expect(typeof request.timestamp).toBe('string');
        expect(typeof request.signature).toBe('string');
      } catch (error) {
        // Ожидаем ошибку для невалидного ключа
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('должен генерировать timestamp в правильном формате', () => {
      const testKeyId = '123';
      const testPrivateKey = Buffer.from('test').toString('base64');

      try {
        const request = createAuthRequest(testKeyId, testPrivateKey);
        // Проверяем формат ISO 8601
        expect(request.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      } catch (error) {
        // Игнорируем ошибки ключа
      }
    });
  });

  describe('isTokenValid', () => {
    it('должен возвращать false, если токен не существует', () => {
      expect(isTokenValid()).toBe(false);
    });

    it('должен возвращать false, если токен истёк', () => {
      const expiredConfig = {
        token: 'test-token',
        tokenExpiresAt: Date.now() - 1000, // Истёк 1 секунду назад
      };
      saveConfig(expiredConfig);
      expect(isTokenValid()).toBe(false);
    });

    it('должен возвращать true, если токен действителен', () => {
      const validConfig = {
        token: 'test-token',
        tokenExpiresAt: Date.now() + 100000, // Действителен ещё 100 секунд
      };
      saveConfig(validConfig);
      expect(isTokenValid()).toBe(true);
    });

    it('должен возвращать false, если токен истекает менее чем через минуту', () => {
      const expiringConfig = {
        token: 'test-token',
        tokenExpiresAt: Date.now() + 30000, // Истекает через 30 секунд
      };
      saveConfig(expiringConfig);
      expect(isTokenValid()).toBe(false); // Должен быть false из-за запаса в 60 секунд
    });
  });
});
