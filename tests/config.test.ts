/**
 * Тесты для модуля конфигурации
 */

import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import {existsSync, unlinkSync, rmdirSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {loadConfig, saveConfig, configExists, getConfigDir} from '../src/config.js';

const CONFIG_DIR = join(homedir(), '.rustore');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

describe('Config Module', () => {
  beforeEach(() => {
    // Удаляем конфиг перед каждым тестом (безопасно)
    try {
      if (existsSync(CONFIG_FILE)) {
        unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Игнорируем ошибки при удалении
    }
  });

  afterEach(() => {
    // Очищаем после теста (безопасно)
    try {
      if (existsSync(CONFIG_FILE)) {
        unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Игнорируем ошибки при удалении
    }
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
    expect(configDir).toBe(CONFIG_DIR);
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
    saveConfig({keyId: 'test'});

    // Проверяем, что файл действительно создан
    expect(existsSync(CONFIG_FILE)).toBe(true);
    expect(configExists()).toBe(true);
  });
});
