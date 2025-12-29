/**
 * Тесты для API платежей и подписок (методы приложений)
 */

import {describe, it, expect} from '@jest/globals';
import {PaymentsAppApi} from '../src/api/payments-app.js';

describe('Payments App API', () => {
  describe('PaymentsAppApi класс', () => {
    it('должен создавать экземпляр', () => {
      const api = new PaymentsAppApi();
      expect(api).toBeInstanceOf(PaymentsAppApi);
    });

    it('должен иметь метод getInvoices', () => {
      const api = new PaymentsAppApi();
      expect(typeof api.getInvoices).toBe('function');
    });

    it('должен иметь метод getPurchase', () => {
      const api = new PaymentsAppApi();
      expect(typeof api.getPurchase).toBe('function');
    });

    it('должен иметь метод getPurchaseList', () => {
      const api = new PaymentsAppApi();
      expect(typeof api.getPurchaseList).toBe('function');
    });
  });
});
