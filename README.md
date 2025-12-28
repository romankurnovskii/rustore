<h1 align="center">rustore<br>CLI для работы с RuStore API</h1>

<p align="center">
  Командная строка для взаимодействия с RuStore API
</p>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## 🌟 Возможности

- 🔐 Авторизация через приватный ключ из RuStore Консоль
- 🔑 Автоматическое управление токенами доступа
- 📦 Работа с API RuStore (платежи, подписки, приложения)
- 📄 Вывод результатов в формате JSON (`--json`) для удобной интеграции и обработки
- ⚙️ Сохранение конфигурации в `~/.rustore/config.json`
- 🧪 Полное покрытие тестами

## 🛠️ Установка

```sh
npm install -g rustore
```

или локально:

```sh
npm install rustore
```

## 📖 Использование

### Первоначальная настройка

Перед использованием CLI необходимо получить приватный ключ в [RuStore Консоль](https://console.rustore.ru/sign-in).

### Авторизация

```sh
# Авторизация с указанием keyId и приватного ключа
rustore login --key-id <keyId> --key <base64-ключ>

# Или короткая форма
rustore login -i <keyId> -k <base64-ключ>
```

**Пример:**

```sh
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
```

### Проверка статуса

```sh
# Показать информацию о текущей авторизации
rustore whoami
```

### Выход из системы

```sh
# Удалить токен (ключи остаются в конфиге)
rustore logout
```

### Работа с приложениями

```sh
# Получить список приложений
rustore apps list

# Получить все приложения (с пагинацией)
rustore apps list --all

# Вывести результат в формате JSON (удобно для скриптов и интеграций)
rustore apps list --json

# Комбинирование опций: получить все приложения в JSON формате
rustore apps list --all --json

# Фильтрация с JSON выводом
rustore apps list --app-name "MyApp" --json
rustore apps list --app-status PUBLISHED --json

# Создать черновую версию приложения
rustore apps create-draft --app-id 123456 --version-name "1.0.0" --version-code 1

# Создать черновую версию с JSON выводом
rustore apps create-draft --app-id 123456 --version-name "2.0.0" --version-code 2 --json
```

**💡 Совет:** Флаг `--json` полезен для:

- Автоматизации и скриптов
- Интеграции с другими инструментами
- Обработки данных через `jq` или другие JSON-парсеры
- Сохранения результатов в файл: `rustore apps list --json > apps.json`

## 📁 Конфигурация

CLI сохраняет конфигурацию в `~/.rustore/config.json`:

```json
{
  "keyId": "ваш-key-id",
  "privateKey": "ваш-приватный-ключ-base64",
  "token": "jwe-токен",
  "tokenExpiresAt": 1234567890
}
```

## 🔧 Разработка

### Установка зависимостей

```sh
npm install
```

### Сборка

```sh
npm run build
```

### Запуск в режиме разработки

```sh
npm start
```

### Тестирование

```sh
# Запустить все тесты
npm test

# Тесты в watch режиме
npm run test:watch

# С покрытием
npm run test:coverage
```

#### Как протестировать текущие изменения

1. **Сборка проекта:**

   ```sh
   npm run build
   ```

2. **Проверка типов:**

   ```sh
   npm run type-check
   # или
   ./node_modules/.bin/tsc --noEmit
   ```

3. **Запуск тестов:**

   ```sh
   npm test
   ```

4. **Тестирование CLI локально:**

   ```sh
   # Запуск без установки (через tsx)
   npm start -- login <keyId> --key <key>

   # Или после сборки
   node dist/bin.js whoami
   ```

5. **Линтинг:**
   ```sh
   npm run lint
   npm run lint:fix
   ```

### Проверка типов

```sh
npm run type-check
```

### Линтинг

```sh
npm run lint
npm run lint:fix
```

## 📚 API

### Структура API

API организовано по категориям, как в документации RuStore:

- **Apps API** (`appsApi`) - Загрузка и публикация приложений (общие методы)
- **Payments API** (`paymentsApi`) - Работа с платежами и подписками (общие методы)
- **Payments App API** (`paymentsAppApi`) - Работа с платежами и подписками (методы приложений)
- **Catalog API** (`catalogApi`) - API для работы с продуктовым каталогом

### Программный доступ

```typescript
import {login, appsApi, paymentsApi, catalogApi} from 'rustore';

// Авторизация
await login('keyId', 'privateKey');

// Получить список приложений
const appsResponse = await appsApi.getAppList();
console.log(appsResponse.body.content);

// Получить все приложения (с автоматической пагинацией)
const allApps = await appsApi.getAllApps();

// Создать черновую версию приложения
const draftVersion = await appsApi.createDraftVersion(123456, {
  versionName: '1.0.0',
  versionCode: 1,
});

// Использование других API категорий
// await paymentsApi.refund(...);
// await catalogApi.getProducts(...);
```

## 🔗 Полезные ссылки

- [Документация RuStore API](https://www.rustore.ru/help/en/work-with-rustore-api)
- [Процесс авторизации](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token)
- [RuStore Консоль](https://console.rustore.ru/sign-in)

## 📝 Лицензия

MIT

[package-name]: rustore
[npm-url]: https://www.npmjs.com/package/rustore
[npm-image]: https://img.shields.io/npm/v/rustore
[github-license]: https://img.shields.io/github/license/romankurnovskii/rustore
[github-license-url]: https://github.com/romankurnovskii/rustore/blob/main/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/rustore
