#!/usr/bin/env node
/**
 * CLI для работы с RuStore API
 */

import {Command} from 'commander';
import {loginCommand, logoutCommand, whoamiCommand} from './commands/auth.js';
import {listAppsCommand, createDraftVersionCommand} from './commands/apps.js';
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
  .requiredOption('--app-id <id>', 'ID приложения', parseInt)
  .requiredOption('--version-name <name>', 'Имя версии (например, 1.0.0)')
  .requiredOption('--version-code <code>', 'Код версии (число)', parseInt)
  .option('-j, --json', 'Вывести результат в формате JSON')
  .action(async options => {
    try {
      await createDraftVersionCommand(
        options.appId,
        options.versionName,
        options.versionCode,
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
