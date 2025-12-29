/**
 * Команды для работы с отзывами
 */

import {feedbackApi} from '../api/feedback.js';
import type {Feedback} from '../types.js';

/**
 * Команда получения отзывов приложения
 */
export async function getFeedbackCommand(
  packageName: string,
  options: {
    all?: boolean;
    json?: boolean;
    pageSize?: number;
    continuationToken?: string;
    [key: string]: string | number | boolean | undefined;
  },
): Promise<void> {
  try {
    // Извлекаем API параметры из options
    const apiOptions: {
      pageSize?: number;
      continuationToken?: string;
      [key: string]: string | number | undefined;
    } = {};

    // Копируем только API параметры (исключаем CLI опции и packageName)
    const cliOptions = ['all', 'json', 'packageName', 'package-name'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все отзывы с пагинацией
      const allFeedback: Feedback[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await feedbackApi.getFeedback(packageName, {
          ...apiOptions,
          continuationToken,
        });
        allFeedback.push(...response.body.content);
        continuationToken = response.body.continuationToken;
      } while (continuationToken);

      outputFeedback(allFeedback, options.json);
    } else {
      const response = await feedbackApi.getFeedback(packageName, apiOptions);
      outputFeedback(response.body.content, options.json);

      if (response.body.continuationToken) {
        console.log(
          `\n⚠️  Есть ещё отзывы. Используйте --all для получения полного списка.`,
        );
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения отзывов: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда создания ответа на отзыв
 */
export async function createFeedbackAnswerCommand(
  packageName: string,
  commentId: number,
  text: string,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await feedbackApi.createFeedbackAnswer(packageName, commentId, {
      text,
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Ответ на отзыв успешно создан!');
      if (response.body) {
        console.log(`   ID ответа: ${response.body.id || 'N/A'}`);
        console.log(`   ID отзыва: ${response.body.commentId || commentId}`);
        console.log(`   Текст: ${response.body.text || text}`);
        console.log(`   Статус: ${response.body.status || 'MODERATION'}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка создания ответа на отзыв: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения статуса ответа на отзыв
 */
export async function getFeedbackAnswerStatusCommand(
  packageName: string,
  feedbackId: number | undefined,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await feedbackApi.getFeedbackAnswerStatus(packageName, feedbackId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      if (response.body.length === 0) {
        console.log('Ответы на отзывы не найдены.');
        return;
      }

      console.log(`\nНайдено ответов: ${response.body.length}\n`);

      response.body.forEach((answer, index) => {
        console.log(`${index + 1}. Ответ ID: ${answer.id}`);
        console.log(`   ID отзыва: ${answer.commentId}`);
        console.log(`   Текст: ${answer.text}`);
        console.log(`   Статус: ${answer.status}`);
        console.log(`   Дата: ${new Date(answer.date).toLocaleString('ru-RU')}`);
        console.log('');
      });
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения статуса ответа: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда изменения ответа на отзыв
 */
export async function updateFeedbackAnswerCommand(
  packageName: string,
  feedbackId: number,
  text: string,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await feedbackApi.updateFeedbackAnswer(packageName, feedbackId, {
      text,
    });

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Ответ на отзыв успешно изменён!');
      if (response.body) {
        console.log(`   ID ответа: ${response.body.id || feedbackId}`);
        console.log(`   Текст: ${response.body.text || text}`);
        console.log(`   Статус: ${response.body.status || 'MODERATION'}`);
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка изменения ответа на отзыв: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда удаления ответа на отзыв
 */
export async function deleteFeedbackAnswerCommand(
  packageName: string,
  feedbackId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await feedbackApi.deleteFeedbackAnswer(packageName, feedbackId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Ответ на отзыв успешно удалён!');
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка удаления ответа на отзыв: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Выводит список отзывов в консоль
 */
function outputFeedback(feedback: Feedback[], json: boolean = false): void {
  if (json) {
    console.log(JSON.stringify(feedback, null, 2));
    return;
  }

  if (feedback.length === 0) {
    console.log('Отзывы не найдены.');
    return;
  }

  console.log(`\nНайдено отзывов: ${feedback.length}\n`);

  feedback.forEach((item, index) => {
    console.log(`${index + 1}. Отзыв ID: ${item.id}`);
    if (item.commentId) {
      console.log(`   ID комментария: ${item.commentId}`);
    }
    if (item.text) {
      console.log(`   Текст: ${item.text}`);
    }
    if (item.rating) {
      console.log(`   Рейтинг: ${item.rating}/5`);
    }
    if (item.userName) {
      console.log(`   Пользователь: ${item.userName}`);
    }
    if (item.date) {
      console.log(`   Дата: ${new Date(item.date).toLocaleString('ru-RU')}`);
    }
    console.log('');
  });
}
