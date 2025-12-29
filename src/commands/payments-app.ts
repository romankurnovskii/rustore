/**
 * Команды для работы с платежами и подписками (методы приложений)
 */

import {paymentsAppApi} from '../api/payments-app.js';

/**
 * Команда получения списка счетов приложения
 *
 * Получает список счетов для указанного приложения с поддержкой пагинации.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-invoices
 */
export async function getInvoicesCommand(
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

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все счета с пагинацией
      const allInvoices: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await paymentsAppApi.getInvoices(packageName, {
          ...apiOptions,
          continuationToken,
        });
        allInvoices.push(...response.body.content);
        continuationToken = response.body.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(JSON.stringify({code: 'OK', body: {content: allInvoices}}, null, 2));
      } else {
        console.log(`✅ Найдено счетов: ${allInvoices.length}`);
        allInvoices.forEach((invoice, index) => {
          console.log(`\nСчёт ${index + 1}:`);
          Object.entries(invoice as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        });
      }
    } else {
      const response = await paymentsAppApi.getInvoices(packageName, apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено счетов: ${response.body.content.length}`);
          response.body.content.forEach((invoice, index) => {
            console.log(`\nСчёт ${index + 1}:`);
            Object.entries(invoice).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response.body.continuationToken) {
            console.log(
              `\n💡 Есть ещё счета. Используйте --all для получения всех счетов.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка счетов: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения информации о покупке
 *
 * Получает детальную информацию о конкретной покупке.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param purchaseId - ID покупки
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase
 */
export async function getPurchaseCommand(
  packageName: string,
  purchaseId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await paymentsAppApi.getPurchase(packageName, purchaseId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Информация о покупке:');
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
      `Ошибка получения информации о покупке: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения списка покупок приложения
 *
 * Получает список покупок для указанного приложения с поддержкой пагинации.
 *
 * @param packageName - Имя пакета приложения (например, com.example.app)
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase-list
 */
export async function getPurchaseListCommand(
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

    // Копируем только API параметры (исключаем CLI опции)
    const cliOptions = ['all', 'json'];
    Object.entries(options).forEach(([key, value]) => {
      if (!cliOptions.includes(key) && value !== undefined) {
        apiOptions[key] = value as string | number;
      }
    });

    if (options.all) {
      // Получаем все покупки с пагинацией
      const allPurchases: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await paymentsAppApi.getPurchaseList(packageName, {
          ...apiOptions,
          continuationToken,
        });
        allPurchases.push(...response.body.content);
        continuationToken = response.body.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(JSON.stringify({code: 'OK', body: {content: allPurchases}}, null, 2));
      } else {
        console.log(`✅ Найдено покупок: ${allPurchases.length}`);
        allPurchases.forEach((purchase, index) => {
          console.log(`\nПокупка ${index + 1}:`);
          Object.entries(purchase as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        });
      }
    } else {
      const response = await paymentsAppApi.getPurchaseList(packageName, apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено покупок: ${response.body.content.length}`);
          response.body.content.forEach((purchase, index) => {
            console.log(`\nПокупка ${index + 1}:`);
            Object.entries(purchase).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response.body.continuationToken) {
            console.log(
              `\n💡 Есть ещё покупки. Используйте --all для получения всех покупок.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка покупок: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
