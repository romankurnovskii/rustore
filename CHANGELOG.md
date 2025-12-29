# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.0.4

## Features

- ✨ Реализованы все оставшиеся endpoints для Upload & Publication App:
  - **Upload AAB File**: `apps upload-aab` - загрузка Android App Bundle файлов
  - **Update Draft Version**: `apps update-draft` - обновление черновой версии приложения
  - **Delete Draft Version**: `apps delete-draft` - удаление черновой версии приложения
  - **Upload Screens**: `apps upload-screens` - загрузка скриншотов для разных типов устройств
  - **Get Version Status**: `apps version-status` - получение статуса модерации версии
- ✨ Все новые endpoints поддерживают динамические параметры и JSON вывод

## Features (Previous)

- ✨ Реализованы все GET endpoints для всех категорий API:
  - **Upload & Publication App**: `apps version-info`, `apps version-list`, `apps tag-list`
  - **Payments & Subscriptions**: `payments get`, `payments subscription`, `payments subscription-list`
  - **Payments & Subscriptions App**: `payments-app invoices`, `payments-app purchase`, `payments-app purchase-list`
  - **Catalog**: `catalog list`, `catalog get`
- ✨ Все новые endpoints поддерживают пагинацию (`--all`) и динамические параметры
- ✨ Все новые endpoints поддерживают вывод в JSON формате (`--json`)

## Documentation

- 📖 Реорганизована структура документации: переведённые README перемещены в `docs/about/`
- 📖 Обновлены перекрёстные ссылки между всеми языковыми версиями README (RU, EN, HI, ZH)
- 📖 Добавлены ссылки на `TODO_API_ENDPOINTS.md` и руководство по отправке APK во все README
- 📖 Переименован `API_ENDPOINTS_TODO.md` → `docs/TODO_API_ENDPOINTS.md`
- 📖 Переименован `docs/how-to-upload-apk.md` → `docs/how-to-submit-apk-for-production.md`
- 📖 Обновлён `docs/TODO_API_ENDPOINTS.md` со статусом всех реализованных GET endpoints

## Technical

- 🔧 Улучшена обработка ошибок загрузки файлов с проверкой существования и доступности
- 🧪 Протестирован и подтверждён полный workflow публикации APK (create-draft → upload-apk → send-for-moderation)
- 🧪 Добавлены тесты для всех новых GET endpoints

# 1.0.3

## Features

- ✨ Добавлена команда `apps send-for-moderation` для отправки черновой версии на модерацию
- ✨ Исправлена обработка ответа API для `createDraftVersion` - теперь корректно извлекается `versionId` из поля `body` (которое является числом, а не объектом)
- 📚 Добавлены ссылки на документацию API во все docstrings
- 📖 Обновлена документация `docs/how-to-submit-apk-for-production.md` (переименовано из `how-to-upload-apk.md`) с правильной структурой ответа API и ссылками на документацию
- 📖 Добавлен раздел "Шаг 5: Отправьте на модерацию" в документацию

## Bug Fixes

- 🐛 Исправлена ошибка `fetch failed` при загрузке больших APK файлов - улучшена обработка ошибок с детальными сообщениями
- 🐛 Исправлена команда `feedback list` - исключен `packageName` из query параметров

## Technical

- 🔧 Улучшено логирование в режиме DEBUG - теперь выводится полный ответ API (статус, заголовки, тело)
- 🔧 Добавлены проверки существования и доступности файла перед загрузкой
- 🔧 Улучшена обработка ошибок загрузки файлов с детальной диагностикой
- 🔧 Исправлена типизация `CreateDraftVersionResponse` - `body` может быть как числом, так и объектом
- 🔧 Упрощен CLI - параметры передаются напрямую без конвертации (используются те же имена, что и в API)
- 🔧 Исправлен endpoint для `createDraftVersion` - использует `packageName` вместо `appId`
- 🔧 Исправлен endpoint для `uploadApkFile` - использует `/apk` вместо `/apk-file` и правильные query параметры
- 🧪 Протестирован полный workflow публикации APK: create-draft → upload-apk → send-for-moderation

# 1.0.2

## Features

- ✨ Добавлена поддержка Feedback API для работы с отзывами приложений
  - Получение отзывов (`feedback list`)
  - Создание ответа на отзыв (`feedback answer`)
  - Получение статуса ответа (`feedback status`)
  - Изменение ответа (`feedback update`)
  - Удаление ответа (`feedback delete`)
- ✨ Добавлена поддержка загрузки APK/AAB файлов (`apps upload-apk`)
- ✨ Добавлена поддержка создания черновой версии приложения (`apps create-draft`)
- 📚 Добавлены ссылки на документацию API в docstring для всех методов и категорий

## Technical

- 🔧 Добавлена поддержка multipart/form-data для загрузки файлов
- 🔧 Улучшена типизация: добавлены типы для всех операций с отзывами
- 🧪 Добавлены тесты для всех новых endpoints

# 1.0.1

## Features

- ✨ Добавлена поддержка фильтрации по параметрам API (`--page-size`, `--app-name`, `--package-name`, `--app-status`, `--paid`)
- ✨ Добавлена поддержка произвольных параметров API через `--param-name value` (автоматическая конвертация kebab-case → camelCase)
- ✨ Улучшен вывод информации о приложениях: добавлены все поля (companyId, role, versionType, iconUrl, activePrice, paid, deviceType)
- ✨ Добавлен флаг `--json` для вывода результатов в формате JSON (удобно для скриптов и интеграций)
- ✨ Добавлена поддержка boolean параметров (автоматическая конвертация `true`/`false` в строки для API)
- 📚 Обновлена документация README с примерами использования `--json` и фильтрации

## Bug Fixes

- 🐛 Исправлена конвертация CLI параметров из kebab-case в camelCase для соответствия API
- 🐛 Исправлена обработка boolean значений в query параметрах

## Documentation

- 📝 Добавлены TODO комментарии о возможных проблемах с фильтром `paid` (требуется проверка документации API)
- 📝 Обновлена документация с примерами использования всех доступных опций

## Technical

- 🔧 Добавлена поддержка `allowUnknownOption()` для автоматической поддержки будущих параметров API
- 🔧 Улучшена типизация: добавлены дополнительные поля в интерфейс `App`
- 🔧 Добавлена индексная сигнатура `[key: string]` для поддержки произвольных параметров API
