#!/usr/bin/env node
/**
 * CLI для работы с RuStore API
 */

import {Command} from 'commander';
import {loginCommand, logoutCommand, whoamiCommand} from './commands/auth.js';
import {
  listAppsCommand,
  createDraftVersionCommand,
  uploadApkFileCommand,
  sendForModerationCommand,
  getVersionInfoCommand,
  getVersionListCommand,
  getAppTagListCommand,
} from './commands/apps.js';
import type {CreateDraftVersionRequest} from './types.js';
import {
  getFeedbackCommand,
  createFeedbackAnswerCommand,
  getFeedbackAnswerStatusCommand,
  updateFeedbackAnswerCommand,
  deleteFeedbackAnswerCommand,
} from './commands/feedback.js';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Получаем версию из package.json
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command();

program
  .name('rustore')
  .description('CLI для работы с RuStore API')
  .version(packageJson.version);

// Команда login
program
  .command('login')
  .description('Авторизация в RuStore API')
  .requiredOption('-i, --key-id <keyId>', 'ID ключа из RuStore Консоль')
  .requiredOption('-k, --key <key>', 'Приватный ключ (Base64)')
  .action(async options => {
    try {
      await loginCommand(options.keyId, options.key);
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Команда logout
program
  .command('logout')
  .description('Выход из системы (удаление токена)')
  .action(() => {
    try {
      logoutCommand();
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Команда whoami
program
  .command('whoami')
  .description('Показать информацию о текущей авторизации')
  .action(() => {
    try {
      whoamiCommand();
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Команды для работы с приложениями
const appsCommand = program.command('apps').description('Работа с приложениями');

appsCommand
  .command('list')
  .description('Получить список приложений')
  .allowUnknownOption() // Разрешаем произвольные параметры для поддержки новых параметров API
  .allowExcessArguments() // Разрешаем дополнительные аргументы
  .option('-a, --all', 'Получить все приложения (с пагинацией)')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .option(
    '--page-size <size>',
    'Размер страницы (количество приложений на странице)',
    parseInt,
  )
  .option('--app-name <name>', 'Фильтр по имени приложения')
  .option('--package-name <name>', 'Фильтр по package name')
  .option(
    '--app-status <status>',
    'Фильтр по статусу приложения (PUBLISHED, DRAFT и т.д.)',
  )
  .option(
    '--paid <true|false>',
    'Фильтр по платным/бесплатным приложениям (TODO: может не работать)',
  )
  .action(async options => {
    try {
      // Парсим неизвестные опции из process.argv
      // Commander не передает неизвестные опции в options автоматически,
      // поэтому парсим их вручную для поддержки будущих параметров API
      const unknownOptions: Record<string, string | number | boolean> = {};
      const knownOptionFlags = [
        '-a',
        '--all',
        '-j',
        '--json',
        '--page-size',
        '--app-name',
        '--package-name',
        '--app-status',
      ];

      // Находим индекс команды 'list' в process.argv
      const listIndex = process.argv.indexOf('list');
      if (listIndex >= 0) {
        // Парсим аргументы после 'list'
        for (let i = listIndex + 1; i < process.argv.length; i++) {
          const arg = process.argv[i];
          if (arg?.startsWith('--') && !knownOptionFlags.includes(arg)) {
            const key = arg.replace(/^--/, '');
            const value = process.argv[i + 1];
            if (value && !value.startsWith('--')) {
              // Конвертируем kebab-case в camelCase для соответствия API
              const camelKey = key.replace(
                /-([a-z])/g,
                (_match: string, letter: string) => letter.toUpperCase(),
              );

              // Парсим значение: boolean, number или string
              let parsedValue: string | number | boolean;
              const lowerValue = value.toLowerCase();
              if (lowerValue === 'true') {
                parsedValue = true;
              } else if (lowerValue === 'false') {
                parsedValue = false;
              } else if (!isNaN(Number(value)) && value.trim() !== '') {
                parsedValue = Number(value);
              } else {
                parsedValue = value;
              }

              unknownOptions[camelKey] = parsedValue as string | number | boolean;
              i++; // Пропускаем значение
            }
          }
        }
      }

      // Объединяем известные и неизвестные опции
      // Благодаря индексной сигнатуре [key: string] в listAppsCommand,
      // все новые параметры API будут автоматически переданы в запрос
      await listAppsCommand({...options, ...unknownOptions});
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('create-draft')
  .description('Создать черновую версию приложения')
  .allowUnknownOption() // Разрешаем произвольные параметры для поддержки всех параметров API
  .allowExcessArguments()
  .requiredOption(
    '--packageName <name>',
    'Имя пакета приложения (например, com.example.app)',
  )
  .requiredOption(
    '--minAndroidVersion <version>',
    'Минимальная версия Android (1-16)',
    parseInt,
  )
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      // Собираем все параметры из CLI, исключая известные опции
      const knownOptions = ['packageName', 'minAndroidVersion', 'json'];
      const apiParams: CreateDraftVersionRequest = {
        minAndroidVersion: options.minAndroidVersion,
      };

      // Парсим неизвестные опции из process.argv
      const createDraftIndex = process.argv.indexOf('create-draft');
      if (createDraftIndex >= 0) {
        for (let i = createDraftIndex + 1; i < process.argv.length; i++) {
          const arg = process.argv[i];
          if (arg?.startsWith('--') && !knownOptions.some(opt => arg.includes(opt))) {
            const key = arg.replace(/^--/, '');
            const value = process.argv[i + 1];
            if (value && !value.startsWith('--')) {
              // Парсим значение
              let parsedValue: unknown = value;
              const lowerValue = value.toLowerCase();
              if (lowerValue === 'true') {
                parsedValue = true;
              } else if (lowerValue === 'false') {
                parsedValue = false;
              } else if (!isNaN(Number(value)) && value.trim() !== '') {
                parsedValue = Number(value);
              } else if (value.startsWith('[') || value.startsWith('{')) {
                try {
                  parsedValue = JSON.parse(value);
                } catch {
                  parsedValue = value;
                }
              }
              apiParams[key] = parsedValue;
              i++;
            }
          }
        }
      }

      await createDraftVersionCommand(options.packageName, apiParams, options.json);
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('upload-apk')
  .description('Загрузить APK файл для версии приложения')
  .allowUnknownOption() // Разрешаем произвольные параметры
  .allowExcessArguments()
  .requiredOption(
    '--packageName <name>',
    'Имя пакета приложения (например, com.example.app)',
  )
  .requiredOption('--versionId <id>', 'ID версии (из create-draft)', parseInt)
  .requiredOption('--file <path>', 'Путь к APK файлу')
  .requiredOption(
    '--isMainApk <true|false>',
    'Признак основного APK-файла (true - основной, false - дополнительный)',
    (value: string) => {
      const lower = value.toLowerCase();
      if (lower === 'true') return true;
      if (lower === 'false') return false;
      throw new Error('isMainApk должен быть true или false');
    },
  )
  .option(
    '--servicesType <type>',
    'Тип сервиса (HMS - для Huawei Mobile Services, Unknown - по умолчанию)',
    (value: string) => {
      if (value === 'HMS' || value === 'Unknown') return value;
      throw new Error('servicesType должен быть HMS или Unknown');
    },
  )
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await uploadApkFileCommand(
        options.packageName,
        options.versionId,
        options.file,
        options.isMainApk,
        options.servicesType,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('send-for-moderation')
  .description('Отправить черновую версию приложения на модерацию')
  .requiredOption(
    '--packageName <name>',
    'Имя пакета приложения (например, com.example.app)',
  )
  .requiredOption('--versionId <id>', 'ID версии (из create-draft)', parseInt)
  .option(
    '--priorityUpdate <priority>',
    'Приоритет обновления (0-5, где 0 - минимальный, 5 - максимальный)',
    parseInt,
  )
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await sendForModerationCommand(
        options.packageName,
        options.versionId,
        options.priorityUpdate,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('version-info')
  .description('Получить информацию о версии приложения')
  .requiredOption(
    '--packageName <name>',
    'Имя пакета приложения (например, com.example.app)',
  )
  .requiredOption('--versionId <id>', 'ID версии', parseInt)
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await getVersionInfoCommand(options.packageName, options.versionId, options.json);
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('version-list')
  .description('Получить список версий приложения')
  .requiredOption(
    '--packageName <name>',
    'Имя пакета приложения (например, com.example.app)',
  )
  .allowUnknownOption()
  .allowExcessArguments()
  .option('-a, --all', 'Получить все версии (с пагинацией)')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .option('--page-size <size>', 'Размер страницы', parseInt)
  .action(async options => {
    try {
      // Парсим неизвестные опции для передачи в API
      const unknownOptions: Record<string, string | number | boolean | undefined> = {};
      const args = process.argv.slice(process.argv.indexOf('version-list') + 1);
      for (let i = 0; i < args.length; i += 2) {
        const arg = args[i];
        const nextArg = args[i + 1];
        if (arg?.startsWith('--') && nextArg) {
          const key = arg.replace('--', '');
          const value = nextArg;
          // Пытаемся определить тип значения
          if (value === 'true' || value === 'false') {
            unknownOptions[key] = value === 'true';
          } else if (!isNaN(Number(value))) {
            unknownOptions[key] = Number(value);
          } else {
            unknownOptions[key] = value;
          }
        }
      }

      await getVersionListCommand(options.packageName, {
        ...options,
        ...unknownOptions,
      });
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

appsCommand
  .command('tag-list')
  .description('Получить список тегов приложений')
  .allowUnknownOption()
  .allowExcessArguments()
  .option('-a, --all', 'Получить все теги (с пагинацией)')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .option('--page-size <size>', 'Размер страницы', parseInt)
  .action(async options => {
    try {
      // Парсим неизвестные опции для передачи в API
      const unknownOptions: Record<string, string | number | boolean | undefined> = {};
      const args = process.argv.slice(process.argv.indexOf('tag-list') + 1);
      for (let i = 0; i < args.length; i += 2) {
        const arg = args[i];
        const nextArg = args[i + 1];
        if (arg?.startsWith('--') && nextArg) {
          const key = arg.replace('--', '');
          const value = nextArg;
          // Пытаемся определить тип значения
          if (value === 'true' || value === 'false') {
            unknownOptions[key] = value === 'true';
          } else if (!isNaN(Number(value))) {
            unknownOptions[key] = Number(value);
          } else {
            unknownOptions[key] = value;
          }
        }
      }

      await getAppTagListCommand({
        ...options,
        ...unknownOptions,
      });
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Команды для работы с отзывами
const feedbackCommand = program
  .command('feedback')
  .description('Работа с отзывами приложений');

feedbackCommand
  .command('list')
  .description('Получить отзывы приложения')
  .requiredOption('--package-name <name>', 'Package name приложения')
  .option('-a, --all', 'Получить все отзывы (с пагинацией)')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .option('--page-size <size>', 'Размер страницы', parseInt)
  .action(async options => {
    try {
      // Извлекаем packageName и передаем остальные опции отдельно
      const {packageName, ...restOptions} = options;
      await getFeedbackCommand(packageName, restOptions);
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

feedbackCommand
  .command('answer')
  .description('Оставить ответ на отзыв')
  .requiredOption('--package-name <name>', 'Package name приложения')
  .requiredOption('--comment-id <id>', 'ID отзыва', parseInt)
  .requiredOption('--text <text>', 'Текст ответа')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await createFeedbackAnswerCommand(
        options.packageName,
        options.commentId,
        options.text,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

feedbackCommand
  .command('status')
  .description('Получить статус ответа на отзыв')
  .requiredOption('--package-name <name>', 'Package name приложения')
  .option(
    '--feedback-id <id>',
    'ID ответа на отзыв (если не указан - все ответы)',
    parseInt,
  )
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await getFeedbackAnswerStatusCommand(
        options.packageName,
        options.feedbackId,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

feedbackCommand
  .command('update')
  .description('Изменить ответ на отзыв')
  .requiredOption('--package-name <name>', 'Package name приложения')
  .requiredOption('--feedback-id <id>', 'ID ответа на отзыв', parseInt)
  .requiredOption('--text <text>', 'Новый текст ответа')
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await updateFeedbackAnswerCommand(
        options.packageName,
        options.feedbackId,
        options.text,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

feedbackCommand
  .command('delete')
  .description('Удалить ответ на отзыв')
  .requiredOption('--package-name <name>', 'Package name приложения')
  .requiredOption('--feedback-id <id>', 'ID ответа на отзыв', parseInt)
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await deleteFeedbackAnswerCommand(
        options.packageName,
        options.feedbackId,
        options.json,
      );
    } catch (error) {
      console.error('Ошибка:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Показываем помощь, если команда не указана
if (process.argv.length === 2) {
  program.help();
}

program.parse();
