/**
 * Тесты для API платежей и подписок (общие методы)
 */

import {describe, it, expect} from '@jest/globals';
import {PaymentsApi} from '../src/api/payments.js';

describe('Payments API', () => {
  const API_BASE_URL = 'https://public-api.rustore.ru';

  describe('PaymentsApi класс', () => {
    it('должен создавать экземпляр', () => {
      const api = new PaymentsApi();
      expect(api).toBeInstanceOf(PaymentsApi);
    });

    it('должен иметь метод getPayment', () => {
      const api = new PaymentsApi();
      expect(typeof api.getPayment).toBe('function');
    });

    it('должен иметь метод getSubscription', () => {
      const api = new PaymentsApi();
      expect(typeof api.getSubscription).toBe('function');
    });

    it('должен иметь метод getSubscriptionList', () => {
      const api = new PaymentsApi();
      expect(typeof api.getSubscriptionList).toBe('function');
    });
  });
});
