/**
 * Команды для работы с продуктовым каталогом
 */

import {catalogApi} from '../api/catalog.js';

/**
 * Команда получения списка продуктов
 *
 * Получает список всех продуктов с поддержкой пагинации.
 *
 * @param options - Параметры запроса (all, json, pageSize, continuationToken)
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog/get-products
 */
export async function getProductsCommand(options: {
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
      // Получаем все продукты с пагинацией
      const allProducts: unknown[] = [];
      let continuationToken: string | undefined;

      do {
        const response = await catalogApi.getProducts({
          ...apiOptions,
          continuationToken,
        });
        allProducts.push(...response.body.content);
        continuationToken = response?.body?.continuationToken;
      } while (continuationToken);

      if (options.json) {
        console.log(JSON.stringify({code: 'OK', body: {content: allProducts}}, null, 2));
      } else {
        console.log(`✅ Найдено продуктов: ${allProducts.length}`);
        allProducts.forEach((product, index) => {
          console.log(`\nПродукт ${index + 1}:`);
          Object.entries(product as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              console.log(`   ${key}: ${JSON.stringify(value)}`);
            }
          });
        });
      }
    } else {
      const response = await catalogApi.getProducts(apiOptions);

      if (options.json) {
        console.log(JSON.stringify(response, null, 2));
      } else {
        if (response.code === 'OK' || response.code === '200') {
          console.log(`✅ Найдено продуктов: ${(response?.body?.content ?? []).length}`);
          (response?.body?.content ?? []).forEach((product, index) => {
            console.log(`\nПродукт ${index + 1}:`);
            Object.entries(product).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                console.log(`   ${key}: ${JSON.stringify(value)}`);
              }
            });
          });
          if (response?.body?.continuationToken) {
            console.log(
              `\n💡 Есть ещё продукты. Используйте --all для получения всех продуктов.`,
            );
          }
        } else {
          throw new Error(response.message || 'Неизвестная ошибка');
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Ошибка получения списка продуктов: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Команда получения информации о продукте
 *
 * Получает детальную информацию о конкретном продукте.
 *
 * @param productId - ID продукта
 * @param json - Вывести результат в формате JSON
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-catalog/get-product
 */
export async function getProductCommand(
  productId: number,
  json: boolean = false,
): Promise<void> {
  try {
    const response = await catalogApi.getProduct(productId);

    if (json) {
      console.log(JSON.stringify(response, null, 2));
      return;
    }

    if (response.code === 'OK' || response.code === '200') {
      console.log('✅ Информация о продукте:');
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
      `Ошибка получения информации о продукте: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
