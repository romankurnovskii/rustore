/**
 * Команды для работы с платежами и подписками (общие методы)
 */

import {paymentsApi} from '../api/payments.js';

/**
 * Команда получения информации о платеже
 *
 * Получает детальную информацию о конкретном платеже.
 *
 * @param paymentId - ID платежа
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-payment
 */
export async function getPaymentCommand(
  paymentId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await paymentsApi.getPayment(paymentId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Информация о платеже:');
      if (response.body) {
        Object.entries(response.body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        });
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения информации о платеже: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения информации о подписке
 *
 * Получает детальную информацию о конкретной подписке.
 *
 * @param subscriptionId - ID подписки
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription
 */
export async function getSubscriptionCommand(
  subscriptionId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await paymentsApi.getSubscription(subscriptionId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Информация о подписке:');
      if (response.body) {
        Object.entries(response.body).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
          }
        });
      }
    } else {
      throw new Error(response.message || 'Неизвестная ошибка');
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения информации о подписке: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения списка подписок
 *
 * Получает список всех подписок с поддержкой пагинации.
 *
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription-list
 */
export async function getSubscriptionListCommand(options: {
  all?: boolean;
  json?: boolean;
  pageSize?: number;
  continuationToken?: string;
  [key: string]: string | number | boolean | undefined;
}): Promise<void> {
  try {
    // Извлекаем API параметры из options
    const apiOptions: {
      pageSize?: number;
      continuationToken?: string;
      [key: string]: string | number | undefined;
    } = {};

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все подписки с пагинацией
      const allSubscriptions: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await paymentsApi.getSubscriptionList({
          ...apiOptions,
          continuationToken,
        });
        allSubscriptions.push(...response.body.content);
        continuationToken = response?.body?.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(
          JSON.stringify({code: 'OK', body: {content: allSubscriptions}}, null, 2),
        );
      } else {
        console.log(`✅ Найдено подписок: ${allSubscriptions.length}`);
        allSubscriptions.forEach((subscription, index) => {
          console.log(`\nПодписка ${index + 1}:`);
          Object.entries(subscription as Record<string, unknown>).forEach(
            ([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            },
          );
        });
      }
    } else {
      const response = await paymentsApi.getSubscriptionList(apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено подписок: ${(response?.body?.content ?? []).length}`);
          (response?.body?.content ?? []).forEach((subscription, index) => {
            console.log(`\nПодписка ${index + 1}:`);
            Object.entries(subscription).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response?.body?.continuationToken) {
            console.log(
              `\n💡 Есть ещё подписки. Используйте --all для получения всех подписок.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка подписок: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
