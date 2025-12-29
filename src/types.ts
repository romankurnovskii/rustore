/**
 * Типы для работы с RuStore API
 */

export interface AuthTokenResponse {
  code: string;
  message?: string;
  body?: {
    jwe: string;
    ttl: number;
  };
  timestamp: string;
}

export interface AuthRequest {
  keyId: string;
  timestamp: string;
  signature: string;
}

export interface Config {
  keyId?: string;
  privateKey?: string;
  token?: string;
  tokenExpiresAt?: number;
}

export interface ApiError {
  code: string;
  message?: string;
  timestamp: string;
}

/**
 * Типы для работы с приложениями
 */
export interface App {
  appId: number;
  packageName: string;
  appName: string;
  iconUrl: string;
  appStatus: string;
  versionName: string;
  versionCode: number;
  companyName: string;
  companyId?: number; // Дополнительное поле из реального API ответа
  shortDescription: string;
  appVerUpdatedAt: string;
  activePrice: number;
  paid: boolean;
  deviceType: string;
  role?: string; // Дополнительное поле из реального API ответа (INDIVIDUAL_OWNER и т.д.)
  versionType?: string; // Дополнительное поле из реального API ответа (REGULAR и т.д.)
  [key: string]: unknown; // Для поддержки будущих полей API
}

export interface GetAppListResponse {
  code: string;
  message?: string;
  body: {
    content: App[];
    continuationToken?: string;
  };
  timestamp: string;
}

/**
 * Параметры для получения списка приложений
 */
export interface GetAppListOptions {
  continuationToken?: string;
  pageSize?: number;
  appName?: string;
  packageName?: string;
  appStatus?: string;
  /**
   * Фильтр по платным/бесплатным приложениям
   * TODO: Проверить документацию API - фильтр может не работать корректно
   * При использовании paid=false API может возвращать пустой результат
   * или игнорировать параметр. Требуется уточнение в документации:
   * https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-list
   */
  paid?: boolean;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Параметры для создания черновой версии приложения
 * POST /public/v1/application/{packageName}/version
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version
 */
export interface CreateDraftVersionRequest {
  /**
   * Наименование версии приложения
   * Максимальная длина — 5 символов
   */
  appName?: string;
  /**
   * Тип версии приложения
   * GAMES - для игр
   * MAIN - для неигровых приложений
   */
  appType?: 'GAMES' | 'MAIN';
  /**
   * Категории версии
   * Максимальное количество категорий — 2 категории
   */
  categories?: string[];
  /**
   * Возрастная категория
   * Возможные варианты: 18+, 16+, 12+, 6+, 0+
   */
  ageLegal?: '18+' | '16+' | '12+' | '6+' | '0+';
  /**
   * Краткое описание версии
   * Максимальная длина — 80 символов
   */
  shortDescription?: string;
  /**
   * Полное описание версии
   * Максимальная длина — 4 000 символов
   */
  fullDescription?: string;
  /**
   * Описание «Что нового»
   * Максимальная длина — 5000 символов
   */
  whatsNew?: string;
  /**
   * Комментарий разработчика для модератора
   * Максимальная длина — 180 символов
   */
  moderInfo?: string;
  /**
   * Стоимость приложения в минимальных единицах валюты (в копейках)
   * Например: «87.99 руб.» = 8799
   * Значение должно быть >0
   */
  priceValue?: string;
  /**
   * ID поисковых тегов из списка
   * Максимальное количество — 5
   * Все теги должны быть либо только для GAMES, либо только для MAIN
   */
  seoTagIds?: number[];
  /**
   * Тип публикации
   * MANUAL - ручная публикация
   * INSTANTLY - автоматическая публикация, сразу после прохождения модерации (по умолчанию)
   * DELAYED - отложенная публикация
   */
  publishType?: 'MANUAL' | 'INSTANTLY' | 'DELAYED';
  /**
   * Дата и время для отложенной публикации
   * Формат: yyyy-MM-dd'T'HH:mm:ssXXX
   * Обязателен только если publishType = DELAYED
   * Дата должна быть не раньше 24 часов и не позже 60 дней с планируемой даты отправки на модерацию
   */
  publishDateTime?: string;
  /**
   * Процент для частичной публикации приложения
   * Возможные значения: 5%, 10%, 25%, 50%, 75%, 100%
   */
  partialValue?: 5 | 10 | 25 | 50 | 75 | 100;
  /**
   * Минимальная версия Android (обязательное поле)
   * Числовое поле от 1 до 16
   */
  minAndroidVersion: number;
  /**
   * Контакты разработчика
   * email - обязательное текстовое поле в формате @.* (например test@mail.ru)
   * website - необязательное текстовое поле (например https://www.rustore.ru/)
   * vkCommunity - необязательное текстовое поле в формате https://vk.com/* (например https://vk.com/rustore_official)
   */
  developerContacts?: Array<{
    email: string;
    website?: string;
    vkCommunity?: string;
  }>;
  /**
   * Список часто задаваемых вопросов и ответов для карточки приложения
   * Максимум 10 элементов
   * question ≤ 120 символов
   * answer ≤ 500 символов
   */
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  [key: string]: unknown; // Для поддержки будущих полей API
}

/**
 * Ответ на создание черновой версии приложения
 *
 * API возвращает versionId напрямую в поле body как число, а не как объект.
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/create-draft-version
 */
export interface CreateDraftVersionResponse {
  code: string;
  message?: string;
  /**
   * ID версии (versionId) возвращается напрямую как число, а не как объект
   * Пример: {"code":"OK","body":2064432562,"timestamp":"..."}
   */
  body?:
    | number
    | {
        versionId?: number;
        versionName?: string;
        versionCode?: number;
        [key: string]: unknown;
      };
  timestamp: string;
}

/**
 * Параметры загрузки APK файла
 */
export interface UploadApkFileOptions {
  /**
   * Признак основного APK-файла (обязательный)
   * true - основной APK-файл
   * false - дополнительный APK-файл
   */
  isMainApk: boolean;
  /**
   * Тип сервиса, используемый в приложении (опциональный)
   * HMS - для APK-файлов c Huawei Mobile Servises
   * Unknown - по умолчанию
   */
  servicesType?: 'HMS' | 'Unknown';
}

/**
 * Ответ на загрузку APK/AAB файла
 * POST /public/v1/application/{packageName}/version/{versionId}/apk
 */
export interface UploadApkFileResponse {
  code: string;
  message?: string;
  body?: {
    fileId?: string;
    fileName?: string;
    fileSize?: number;
    [key: string]: unknown;
  };
  timestamp: string;
}

/**
 * Параметры отправки черновой версии на модерацию
 */
export interface SendForModerationOptions {
  /**
   * Приоритет обновления (опциональный)
   * От 0 до 5, где 0 — минимальный, а 5 — максимальный
   * По умолчанию равно 0
   */
  priorityUpdate?: number;
}

/**
 * Ответ на отправку черновой версии на модерацию
 * POST /public/v1/application/{packageName}/version/{versionId}/commit
 */
export interface SendForModerationResponse {
  code: string;
  message?: string;
  timestamp: string;
}

/**
 * Информация о версии приложения
 * GET /public/v1/application/{packageName}/version/{versionId}
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-version-info
 */
export interface VersionInfo {
  versionId?: number;
  versionName?: string;
  versionCode?: number;
  versionType?: string;
  status?: string;
  minAndroidVersion?: number;
  [key: string]: unknown;
}

/**
 * Ответ на запрос информации о версии
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-version-info
 */
export interface GetVersionInfoResponse {
  code: string;
  message?: string;
  body?: VersionInfo;
  timestamp: string;
}

/**
 * Параметры для получения списка версий
 * GET /public/v1/application/{packageName}/version
 */
export interface GetVersionListOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Ответ на запрос списка версий
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-version-list
 */
export interface GetVersionListResponse {
  code: string;
  message?: string;
  body: {
    content: VersionInfo[];
    continuationToken?: string;
    pageSize?: number;
  };
  timestamp: string;
}

/**
 * Тег приложения
 * GET /public/v1/application/tag
 */
export interface AppTag {
  tagId?: number;
  tagName?: string;
  seoTagId?: number;
  [key: string]: unknown;
}

/**
 * Ответ на запрос списка тегов приложений
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app/get-app-tag-list
 */
export interface GetAppTagListResponse {
  code: string;
  message?: string;
  body: {
    content: AppTag[];
    continuationToken?: string;
    pageSize?: number;
  };
  timestamp: string;
}

/**
 * Параметры для получения списка тегов
 */
export interface GetAppTagListOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Типы для работы с платежами и подписками (общие методы)
 */

/**
 * Информация о платеже
 * GET /public/v1/payment/{paymentId}
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-payment
 */
export interface Payment {
  paymentId?: number;
  amount?: number;
  currency?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Ответ на запрос информации о платеже
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-payment
 */
export interface GetPaymentResponse {
  code: string;
  message?: string;
  body?: Payment;
  timestamp: string;
}

/**
 * Информация о подписке
 * GET /public/v1/subscription/{subscriptionId}
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription
 */
export interface Subscription {
  subscriptionId?: number;
  status?: string;
  productId?: string;
  [key: string]: unknown;
}

/**
 * Ответ на запрос информации о подписке
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription
 */
export interface GetSubscriptionResponse {
  code: string;
  message?: string;
  body?: Subscription;
  timestamp: string;
}

/**
 * Параметры для получения списка подписок
 * GET /public/v1/subscription
 */
export interface GetSubscriptionListOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Ответ на запрос списка подписок
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions/get-subscription-list
 */
export interface GetSubscriptionListResponse {
  code: string;
  message?: string;
  body: {
    content: Subscription[];
    continuationToken?: string;
    pageSize?: number;
  };
  timestamp: string;
}

/**
 * Типы для работы с платежами и подписками (методы приложений)
 */

/**
 * Информация о счете (invoice)
 * GET /public/v1/application/{packageName}/invoice
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-invoices
 */
export interface Invoice {
  invoiceId?: number;
  amount?: number;
  currency?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Параметры для получения списка счетов
 * GET /public/v1/application/{packageName}/invoice
 */
export interface GetInvoicesOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Ответ на запрос списка счетов
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-invoices
 */
export interface GetInvoicesResponse {
  code: string;
  message?: string;
  body: {
    content: Invoice[];
    continuationToken?: string;
    pageSize?: number;
  };
  timestamp: string;
}

/**
 * Информация о покупке
 * GET /public/v1/application/{packageName}/purchase/{purchaseId}
 *
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase
 */
export interface Purchase {
  purchaseId?: number;
  productId?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Ответ на запрос информации о покупке
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase
 */
export interface GetPurchaseResponse {
  code: string;
  message?: string;
  body?: Purchase;
  timestamp: string;
}

/**
 * Параметры для получения списка покупок
 * GET /public/v1/application/{packageName}/purchase
 */
export interface GetPurchaseListOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Ответ на запрос списка покупок
 * @see https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app/get-purchase-list
 */
export interface GetPurchaseListResponse {
  code: string;
  message?: string;
  body: {
    content: Purchase[];
    continuationToken?: string;
    pageSize?: number;
  };
  timestamp: string;
}

/**
 * Типы для работы с отзывами (Feedback API)
 */

/**
 * Отзыв приложения
 */
export interface Feedback {
  id: number;
  commentId: number;
  text?: string;
  rating?: number;
  date?: string;
  userName?: string;
  [key: string]: unknown;
}

/**
 * Ответ на отзыв
 */
export interface FeedbackAnswer {
  id: number;
  commentId: number;
  text: string;
  status: 'PUBLISHED' | 'MODERATION' | 'REJECTED' | 'DELETED';
  date: string;
  [key: string]: unknown;
}

/**
 * Параметры для получения отзывов
 * GET /public/v1/application/{packageName}/feedback
 */
export interface GetFeedbackOptions {
  continuationToken?: string;
  pageSize?: number;
  [key: string]: string | number | undefined;
}

/**
 * Ответ на получение отзывов
 */
export interface GetFeedbackResponse {
  code: string;
  message?: string;
  body: {
    content: Feedback[];
    continuationToken?: string;
  };
  timestamp: string;
}

/**
 * Параметры для создания ответа на отзыв
 * POST /public/v1/application/{packageName}/feedback/{commentId}/answer
 */
export interface CreateFeedbackAnswerRequest {
  text: string;
  [key: string]: unknown;
}

/**
 * Ответ на создание ответа на отзыв
 */
export interface CreateFeedbackAnswerResponse {
  code: string;
  message?: string;
  body?: {
    id?: number;
    commentId?: number;
    text?: string;
    status?: string;
    [key: string]: unknown;
  };
  timestamp: string;
}

/**
 * Ответ на получение статуса ответа на отзыв
 * GET /public/v1/application/{packageName}/feedback/{feedbackId}
 */
export interface GetFeedbackAnswerStatusResponse {
  code: string;
  message?: string;
  body: FeedbackAnswer[];
  timestamp: string;
}

/**
 * Параметры для изменения ответа на отзыв
 * PUT /public/v1/application/{packageName}/feedback/{feedbackId}
 */
export interface UpdateFeedbackAnswerRequest {
  text: string;
  [key: string]: unknown;
}

/**
 * Ответ на изменение ответа на отзыв
 */
export interface UpdateFeedbackAnswerResponse {
  code: string;
  message?: string;
  body?: FeedbackAnswer;
  timestamp: string;
}

/**
 * Ответ на удаление ответа на отзыв
 * DELETE /public/v1/application/{packageName}/feedback/{feedbackId}
 */
export interface DeleteFeedbackAnswerResponse {
  code: string;
  message?: string;
  body?: unknown;
  timestamp: string;
}
