# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.0.1 (2025-01-27)

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

<!--

# 1.0.0 (2023-04-07)

## Breaking changes

## Features

## Bug Fixes

- correct the types

## Reverts

-->
