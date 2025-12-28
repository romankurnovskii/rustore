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
 * POST /public/v1/application/{appId}/draft-version
 */
export interface CreateDraftVersionRequest {
  versionName: string;
  versionCode: number;
  [key: string]: unknown; // Для поддержки будущих полей API
}

/**
 * Ответ на создание черновой версии приложения
 */
export interface CreateDraftVersionResponse {
  code: string;
  message?: string;
  body?: {
    versionId?: number;
    versionName?: string;
    versionCode?: number;
    [key: string]: unknown;
  };
  timestamp: string;
}

/**
 * Ответ на загрузку APK/AAB файла
 * POST /public/v1/application/{appId}/version/{versionId}/apk-file
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
