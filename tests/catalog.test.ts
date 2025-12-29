/**
 * Тесты для API продуктового каталога
 */

import {describe, it, expect} from '@jest/globals';
import {CatalogApi} from '../src/api/catalog.js';

describe('Catalog API', () => {
  describe('CatalogApi класс', () => {
    it('должен создавать экземпляр', () => {
      const api = new CatalogApi();
      expect(api).toBeInstanceOf(CatalogApi);
    });

    it('должен иметь метод getProducts', () => {
      const api = new CatalogApi();
      expect(typeof api.getProducts).toBe('function');
    });

    it('должен иметь метод getProduct', () => {
      const api = new CatalogApi();
      expect(typeof api.getProduct).toBe('function');
    });
  });
});
