/**
 * Тесты для API отзывов
 */

import {describe, it, expect} from '@jest/globals';
import {FeedbackApi} from '../src/api/feedback.js';

describe('Feedback API', () => {
  const API_BASE_URL = 'https://public-api.rustore.ru';

  it('должен проверять доступность endpoint получения отзывов', async () => {
    // Проверяем, что endpoint отвечает (может вернуть 404, 401, 403 или другой статус)
    const testPackageName = 'com.example.app';
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен возвращать ошибку без токена при получении отзывов', async () => {
    const testPackageName = 'com.example.app';
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Без авторизации должен вернуть ошибку (401, 403, 404 или другой код ошибки)
    expect(response.status).toBeGreaterThanOrEqual(400);
  }, 10000);

  it('должен проверять доступность endpoint создания ответа на отзыв', async () => {
    const testPackageName = 'com.example.app';
    const testCommentId = 123456;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback/${testCommentId}/answer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Test answer',
        }),
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint получения статуса ответа', async () => {
    const testPackageName = 'com.example.app';
    const testFeedbackId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback/${testFeedbackId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint изменения ответа', async () => {
    const testPackageName = 'com.example.app';
    const testFeedbackId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback/${testFeedbackId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Updated answer',
        }),
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  it('должен проверять доступность endpoint удаления ответа', async () => {
    const testPackageName = 'com.example.app';
    const testFeedbackId = 789;
    const response = await fetch(
      `${API_BASE_URL}/public/v1/application/${testPackageName}/feedback/${testFeedbackId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Endpoint должен отвечать (любой статус кроме сетевых ошибок)
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
  }, 10000);

  describe('FeedbackApi класс', () => {
    it('должен создавать экземпляр', () => {
      const api = new FeedbackApi();
      expect(api).toBeInstanceOf(FeedbackApi);
    });

    it('должен иметь метод getFeedback', () => {
      const api = new FeedbackApi();
      expect(typeof api.getFeedback).toBe('function');
    });

    it('должен иметь метод createFeedbackAnswer', () => {
      const api = new FeedbackApi();
      expect(typeof api.createFeedbackAnswer).toBe('function');
    });

    it('должен иметь метод getFeedbackAnswerStatus', () => {
      const api = new FeedbackApi();
      expect(typeof api.getFeedbackAnswerStatus).toBe('function');
    });

    it('должен иметь метод updateFeedbackAnswer', () => {
      const api = new FeedbackApi();
      expect(typeof api.updateFeedbackAnswer).toBe('function');
    });

    it('должен иметь метод deleteFeedbackAnswer', () => {
      const api = new FeedbackApi();
      expect(typeof api.deleteFeedbackAnswer).toBe('function');
    });
  });
});
