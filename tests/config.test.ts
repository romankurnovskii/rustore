/**
 * Тесты для модуля конфигурации
 */

import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import {existsSync, unlinkSync, rmdirSync, mkdtempSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {loadConfig, saveConfig, configExists, getConfigDir} from '../src/config.js';

// Используем временную директорию для тестов, чтобы не трогать реальный конфиг пользователя
const TEST_CONFIG_DIR = mkdtempSync(join(tmpdir(), 'rustore-test-'));
const TEST_CONFIG_FILE = join(TEST_CONFIG_DIR, 'config.json');

// Устанавливаем переменную окружения для использования тестовой директории
process.env.RUSTORE_CONFIG_DIR = TEST_CONFIG_DIR;

describe('Config Module', () => {
  beforeEach(() => {
    // Удаляем тестовый конфиг перед каждым тестом
    try {
      if (existsSync(TEST_CONFIG_FILE)) {
        unlinkSync(TEST_CONFIG_FILE);
      }
    } catch {
      // Игнорируем ошибки при удалении
    }
  });

  afterEach(() => {
    // Очищаем после теста
    try {
      if (existsSync(TEST_CONFIG_FILE)) {
        unlinkSync(TEST_CONFIG_FILE);
      }
    } catch {
      // Игнорируем ошибки при удалении
    }
  });

  afterAll(() => {
    // Очищаем тестовую директорию после всех тестов
    try {
      if (existsSync(TEST_CONFIG_DIR)) {
        rmdirSync(TEST_CONFIG_DIR, {recursive: true});
      }
    } catch {
      // Игнорируем ошибки при удалении
    }
    // Восстанавливаем переменную окружения
    delete process.env.RUSTORE_CONFIG_DIR;
  });

  it('должен возвращать пустой объект, если конфиг не существует', () => {
    const config = loadConfig();
    expect(config).toEqual({});
  });

  it('должен сохранять и загружать конфигурацию', () => {
    const testConfig = {
      keyId: 'test-key-id',
      privateKey: 'test-private-key',
      token: 'test-token',
    };

    saveConfig(testConfig);
    expect(configExists()).toBe(true);

    const loadedConfig = loadConfig();
    expect(loadedConfig.keyId).toBe(testConfig.keyId);
    expect(loadedConfig.privateKey).toBe(testConfig.privateKey);
    expect(loadedConfig.token).toBe(testConfig.token);
  });

  it('должен объединять существующую конфигурацию с новой', () => {
    const initialConfig = {
      keyId: 'initial-key-id',
      privateKey: 'initial-key',
    };

    saveConfig(initialConfig);

    const additionalConfig = {
      token: 'new-token',
    };

    saveConfig(additionalConfig);

    const loadedConfig = loadConfig();
    expect(loadedConfig.keyId).toBe(initialConfig.keyId);
    expect(loadedConfig.privateKey).toBe(initialConfig.privateKey);
    expect(loadedConfig.token).toBe(additionalConfig.token);
  });

  it('должен возвращать правильный путь к директории конфигурации', () => {
    const configDir = getConfigDir();
    expect(configDir).toBe(TEST_CONFIG_DIR);
  });

  it('должен корректно определять существование конфига', () => {
    // Убеждаемся, что конфиг не существует
    try {
      if (existsSync(CONFIG_FILE)) {
        unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Игнорируем ошибки
    }
    expect(configExists()).toBe(false);

    // Сохраняем конфиг
    const testConfig = {keyId: 'test'};
    saveConfig(testConfig);

    // Проверяем, что файл действительно создан
    // Используем configExists() вместо прямого existsSync для консистентности
    expect(configExists()).toBe(true);

    // Дополнительная проверка через loadConfig
    const loadedConfig = loadConfig();
    expect(loadedConfig.keyId).toBe(testConfig.keyId);
  });
});
