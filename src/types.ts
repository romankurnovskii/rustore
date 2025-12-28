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
