import {loadConfig, saveConfig} from '../src/config.js';

describe('Index exports', () => {
  it('должен экспортировать функции конфигурации', () => {
    expect(typeof loadConfig).toBe('function');
    expect(typeof saveConfig).toBe('function');
  });
});
