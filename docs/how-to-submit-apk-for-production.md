# Как отправить APK файл в продакшн RuStore

Пошаговая инструкция по публикации APK файла в продакшн через CLI rustore.

**Полный workflow:**

1. Авторизация
2. Поиск packageName приложения
3. Создание черновой версии
4. Загрузка APK файла
5. Отправка на модерацию
6. Проверка результата

## Предварительные требования

1. **Приватный ключ из RuStore Консоль**
   - Получите приватный ключ в [RuStore Консоль](https://console.rustore.ru/sign-in)
   - Вам понадобятся `keyId` и приватный ключ в формате base64

2. **Установленный CLI rustore**

   ```sh
   npm install -g rustore
   # или используйте через npx
   npx rustore --help
   ```

3. **Подготовленный APK файл**
   - Файл должен иметь расширение `.apk`
   - Размер файла не должен превышать 5 ГБ
   - Файл должен быть подписан

## Шаг 1: Авторизация

Авторизуйтесь в CLI, используя ваш `keyId` и приватный ключ:

```sh
rustore login --key-id <ваш-keyId> --key <ваш-приватный-ключ-base64>
```

**Пример:**

```sh
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
```

Проверьте, что авторизация прошла успешно:

```sh
rustore whoami
```

## Шаг 2: Найдите packageName вашего приложения

Получите список ваших приложений и найдите `packageName` нужного приложения:

```sh
rustore apps list --json
```

Или для удобного просмотра:

```sh
rustore apps list
```

Найдите в списке ваше приложение и скопируйте значение `packageName` (например, `com.example.app`).

## Шаг 3: Создайте черновую версию приложения

Создайте черновую версию приложения. Это обязательный шаг перед загрузкой APK.

**Ссылка на документацию API:**

- [Создание черновой версии приложения](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version)

**Минимальный набор параметров:**

```sh
rustore apps create-draft \
  --packageName com.example.app \
  --minAndroidVersion 8
```

**Полный пример с дополнительными параметрами:**

```sh
rustore apps create-draft \
  --packageName com.example.app \
  --minAndroidVersion 8 \
  --appName "Моё приложение" \
  --appType MAIN \
  --categories "news,education" \
  --ageLegal "6+" \
  --shortDescription "Краткое описание приложения" \
  --fullDescription "Полное описание приложения" \
  --whatsNew "Что нового в этой версии" \
  --publishType INSTANTLY
```

**Важно:** Сохраните `versionId` из ответа команды! Он понадобится на следующем шаге.

**Пример успешного ответа:**

API возвращает `versionId` напрямую в поле `body` как число:

```json
{
  "code": "OK",
  "message": "OK",
  "body": 2064432562,
  "timestamp": "2025-12-29T06:19:58.252Z"
}
```

В этом примере `versionId = 2064432562` (это значение поля `body`).

**Ссылка на документацию API:**

- [Создание черновой версии приложения](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version)

## Шаг 4: Загрузите APK файл

Используйте полученный `versionId` для загрузки APK файла.

**Ссылка на документацию API:**

- [Загрузка APK файла](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/apk-file-upload/file-upload-apk)

```sh
rustore apps upload-apk \
  --packageName com.example.app \
  --versionId 2064432562 \
  --file ./app-release.apk \
  --isMainApk true
```

**Параметры:**

- `--packageName` - имя пакета приложения (то же, что использовали в шаге 3)
- `--versionId` - ID версии, полученный на шаге 3
- `--file` - путь к APK файлу
- `--isMainApk` - `true` для основного APK, `false` для дополнительного
- `--servicesType` (опционально) - `HMS` для Huawei Mobile Services, `Unknown` по умолчанию

**Пример с Huawei Mobile Services:**

```sh
rustore apps upload-apk \
  --packageName com.example.app \
  --versionId 2064432562 \
  --file ./app-release-hms.apk \
  --isMainApk false \
  --servicesType HMS
```

## Шаг 5: Отправьте на модерацию

После успешной загрузки APK файла отправьте черновую версию на модерацию.

**Ссылка на документацию API:**

- [Отправка черновой версии на модерацию](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/send-draft-app-for-moderation)

```sh
rustore apps send-for-moderation \
  --packageName com.example.app \
  --versionId 2064432562
```

**С приоритетом обновления:**

```sh
rustore apps send-for-moderation \
  --packageName com.example.app \
  --versionId 2064432562 \
  --priorityUpdate 5
```

**Параметры:**

- `--packageName` - имя пакета приложения (то же, что использовали ранее)
- `--versionId` - ID версии, полученный на шаге 3
- `--priorityUpdate` (опционально) - приоритет обновления от 0 до 5 (0 - минимальный, 5 - максимальный)

**Важно:** Перед отправкой на модерацию убедитесь, что:

- Загружен хотя бы один основной APK-файл (с `isMainApk=true`)
- Если загружены только HMS APK-файлы, нужно также загрузить основной не-HMS APK

## Шаг 6: Проверьте результат

**После загрузки APK:**
Если загрузка прошла успешно, вы увидите:

```
✅ APK файл успешно загружен!
   ID файла: 12345
   Имя файла: app-release.apk
   Размер: 95.23 MB
```

**После отправки на модерацию:**
Если отправка прошла успешно, вы увидите:

```
✅ Черновая версия успешно отправлена на модерацию!
   Приложение будет проверено модераторами RuStore.
```

После этого приложение будет проверено модераторами RuStore. Статус модерации можно проверить в [RuStore Консоль](https://console.rustore.ru).

## Полный пример (от начала до конца)

```sh
# 1. Авторизация
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...

# 2. Получить список приложений
rustore apps list --json > apps.json
# Найдите packageName в файле apps.json

# 3. Создать черновую версию
rustore apps create-draft \
  --packageName com.dailyfive.fitness \
  --minAndroidVersion 8 \
  --appName "База 5" \
  --appType MAIN \
  --publishType INSTANTLY \
  --json > draft.json
# Сохраните versionId из draft.json (body - это сам versionId как число)

# 4. Загрузить APK
# API возвращает versionId напрямую в поле body как число
rustore apps upload-apk \
  --packageName com.dailyfive.fitness \
  --versionId $(cat draft.json | jq -r '.body') \
  --file ./app-release.apk \
  --isMainApk true

# 5. Отправить на модерацию
rustore apps send-for-moderation \
  --packageName com.dailyfive.fitness \
  --versionId $(cat draft.json | jq -r '.body')
```

## Частые ошибки и решения

### Ошибка: "Version with id = X not found"

**Причина:** Вы использовали неправильный `versionId` (возможно, `appId` вместо `versionId`).

**Решение:**

- Убедитесь, что вы используете `versionId` из ответа команды `create-draft`, а не `appId` из списка приложений
- Если версия уже существует, используйте ID из сообщения об ошибке "You already have draft version with ID = X"

### Ошибка: "You already have draft version with ID = X"

**Причина:** У вас уже есть черновая версия для этого приложения.

**Решение:**

- Используйте указанный в сообщении ID для загрузки APK
- Или удалите существующую версию через RuStore Консоль и создайте новую

### Ошибка: "413 Request Entity Too Large"

**Причина:** Файл слишком большой или неправильно отправляется.

**Решение:**

- Проверьте размер файла (максимум 5 ГБ)
- Убедитесь, что файл существует и доступен для чтения
- Проверьте, что вы используете правильные параметры команды

### Ошибка: "packageName not found"

**Причина:** Неправильное имя пакета.

**Решение:** Проверьте `packageName` в списке приложений командой `rustore apps list`.

### Ошибка: "Version must have at least one main non-HMS apk-file"

**Причина:** Не загружен основной APK-файл с сервисом отличным от HMS.

**Решение:**

- Убедитесь, что вы загрузили хотя бы один APK с `isMainApk=true` и `servicesType=Unknown` (или без указания servicesType)
- Если загружены только HMS APK-файлы, нужно также загрузить основной не-HMS APK

### Ошибка: "Version must have not only HMS apk-file"

**Причина:** Загружены только HMS APK-файлы.

**Решение:** Загрузите хотя бы один основной APK-файл с `servicesType=Unknown` или без указания servicesType.

### Ошибка: "Packages for version with id = X is not found"

**Причина:** Не загружен APK файл для версии.

**Решение:** Убедитесь, что вы загрузили APK файл перед отправкой на модерацию.

## Полезные команды

```sh
# Получить список приложений в JSON формате
rustore apps list --json

# Получить информацию о текущей авторизации
rustore whoami

# Выйти из системы
rustore logout

# Получить справку по команде
rustore apps create-draft --help
rustore apps upload-apk --help
rustore apps send-for-moderation --help

# Проверить статус модерации (через RuStore Консоль)
# https://console.rustore.ru
```

## Дополнительная информация

- [Документация RuStore API](https://www.rustore.ru/help/work-with-rustore-api)
- [Загрузка и публикация приложений (общие методы)](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app)
- [Создание черновой версии приложения](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version)
- [Загрузка APK файла](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/apk-file-upload/file-upload-apk)
- [Отправка черновой версии на модерацию](https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/send-draft-app-for-moderation)
