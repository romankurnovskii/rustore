# RuStore API Endpoints - Implementation Status

This document tracks all RuStore API endpoints and their implementation status in the CLI tool.

## Status Legend

- ✅ **Implemented** - Fully implemented, tested, and documented
- 🧪 **Tested** - Implemented and has tests
- ⚠️ **Issues** - Implemented but has known issues
- 🚧 **Beta** - Implemented but needs more testing/verification
- ❌ **Not Implemented** - Not yet implemented

## API Categories

### 1. Authorization (Авторизация)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token`

| Endpoint                | Method               | Status | Notes                                  |
| ----------------------- | -------------------- | ------ | -------------------------------------- |
| Get Authorization Token | POST `/public/auth/` | ✅ 🧪  | Fully implemented in `src/api/auth.ts` |

### 2. Upload & Publication App (Загрузка и публикация приложений)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-upload-publication-app`

| Endpoint                  | Method                                                                 | Status | Notes                                       |
| ------------------------- | ---------------------------------------------------------------------- | ------ | ------------------------------------------- |
| Get App List              | GET `/public/v1/application`                                           | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Create Draft Version      | POST `/public/v1/application/{packageName}/version`                    | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Upload APK File           | POST `/public/v1/application/{packageName}/version/{versionId}/apk`    | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Upload AAB File           | POST `/public/v1/application/{packageName}/version/{versionId}/aab`    | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Send Draft for Moderation | POST `/public/v1/application/{packageName}/version/{versionId}/commit` | ✅ 🧪  | Implemented and tested in `src/api/apps.ts` |
| Get App Tag List          | GET `/public/v1/application/tag`                                       | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Update Draft Version      | PUT `/public/v1/application/{packageName}/version/{versionId}`         | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Delete Draft Version      | DELETE `/public/v1/application/{packageName}/version/{versionId}`      | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Get Version Info          | GET `/public/v1/application/{packageName}/version/{versionId}`         | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Get Version List          | GET `/public/v1/application/{packageName}/version`                     | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Upload Screens            | POST `/public/v1/application/{packageName}/version/{versionId}/screens` | ✅ 🧪  | Implemented in `src/api/apps.ts`            |
| Get Version Status        | GET `/public/v1/application/{packageName}/version/{versionId}/status`  | ✅ 🧪  | Implemented in `src/api/apps.ts`            |

### 3. Feedback Process (Работа с отзывами)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-feedback-process`

| Endpoint                   | Method                                                                  | Status | Notes                                |
| -------------------------- | ----------------------------------------------------------------------- | ------ | ------------------------------------ |
| Get Feedback               | GET `/public/v1/application/{packageName}/feedback`                     | ✅ 🧪  | Implemented in `src/api/feedback.ts` |
| Create Feedback Answer     | POST `/public/v1/application/{packageName}/feedback/{commentId}/answer` | ✅ 🧪  | Implemented in `src/api/feedback.ts` |
| Get Feedback Answer Status | GET `/public/v1/application/{packageName}/feedback/{feedbackId}`        | ✅ 🧪  | Implemented in `src/api/feedback.ts` |
| Update Feedback Answer     | PUT `/public/v1/application/{packageName}/feedback/{feedbackId}`        | ✅ 🧪  | Implemented in `src/api/feedback.ts` |
| Delete Feedback Answer     | DELETE `/public/v1/application/{packageName}/feedback/{feedbackId}`     | ✅ 🧪  | Implemented in `src/api/feedback.ts` |

### 4. Payments & Subscriptions (Платежи и подписки - общие методы)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions`

| Endpoint              | Method                                                 | Status | Notes           |
| --------------------- | ------------------------------------------------------ | ------ | --------------- |
| Refund                | POST `/public/v1/payment/refund`                       | ❌     | Not implemented |
| Get Payment           | GET `/public/v1/payment/{paymentId}`                   | ✅ 🧪  | Implemented in `src/api/payments.ts`        |
| Get Subscription      | GET `/public/v1/subscription/{subscriptionId}`         | ✅ 🧪  | Implemented in `src/api/payments.ts`        |
| Cancel Subscription   | POST `/public/v1/subscription/{subscriptionId}/cancel` | ❌     | Not implemented |
| Get Subscription List | GET `/public/v1/subscription`                          | ✅ 🧪  | Implemented in `src/api/payments.ts`        |

### 5. Payments & Subscriptions App (Платежи и подписки - методы приложений)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app`

| Endpoint          | Method                                                           | Status | Notes           |
| ----------------- | ---------------------------------------------------------------- | ------ | --------------- |
| Get Invoices      | GET `/public/v1/application/{packageName}/invoice`               | ✅ 🧪  | Implemented in `src/api/payments-app.ts`    |
| Confirm Purchase  | POST `/public/v1/application/{packageName}/purchase/confirm`     | ❌     | Not implemented |
| Cancel Purchase   | POST `/public/v1/application/{packageName}/purchase/cancel`      | ❌     | Not implemented |
| Get Purchase      | GET `/public/v1/application/{packageName}/purchase/{purchaseId}` | ✅ 🧪  | Implemented in `src/api/payments-app.ts`    |
| Get Purchase List | GET `/public/v1/application/{packageName}/purchase`              | ✅ 🧪  | Implemented in `src/api/payments-app.ts`    |

### 6. Catalog (Продуктовый каталог)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-catalog`

| Endpoint       | Method                                          | Status | Notes           |
| -------------- | ----------------------------------------------- | ------ | --------------- |
| Get Products   | GET `/public/v1/catalog/product`                | ✅ 🧪  | Implemented in `src/api/catalog.ts`          |
| Get Product    | GET `/public/v1/catalog/product/{productId}`    | ✅ 🧪  | Implemented in `src/api/catalog.ts`          |
| Create Product | POST `/public/v1/catalog/product`               | ❌     | Not implemented |
| Update Product | PUT `/public/v1/catalog/product/{productId}`    | ❌     | Not implemented |
| Delete Product | DELETE `/public/v1/catalog/product/{productId}` | ❌     | Not implemented |

## Implementation Priority

### High Priority (Core Functionality)

1. ✅ Get App List
2. ✅ Create Draft Version
3. ✅ Upload APK File
4. ✅ Send Draft for Moderation
5. ❌ Upload AAB File (for Android App Bundle support)
6. ✅ Get Version Info (to check version status)
7. ❌ Update Draft Version (to modify draft before submission)

### Medium Priority (Useful Features)

1. ✅ Get App Tag List (needed for create-draft with seoTagIds)
2. ✅ Get Version List (to see all versions)
3. ❌ Delete Draft Version (cleanup)
4. ✅ Get Payment/Subscription info (for financial operations)

### Low Priority (Nice to Have)

1. ✅ GET Payments endpoints (Get Payment, Get Subscription, Get Subscription List)
2. ✅ GET Payments App endpoints (Get Invoices, Get Purchase, Get Purchase List)
3. ✅ GET Catalog endpoints (Get Products, Get Product)
4. ❌ POST/PUT/DELETE Payments endpoints (Refund, Cancel Subscription, etc.)
5. ❌ POST/PUT/DELETE Catalog endpoints (Create, Update, Delete Product)
6. ❌ Advanced version management

## Notes

- All implemented endpoints should have:
  - ✅ Type definitions in `src/types.ts`
  - ✅ API method in appropriate `src/api/*.ts` file
  - ✅ CLI command in `src/commands/*.ts`
  - ✅ Command registration in `src/bin.ts`
  - ✅ Tests in `tests/*.test.ts`
  - ✅ Documentation links (`@see`) in docstrings
  - ✅ README examples

- When implementing new endpoints:
  - Use exact API parameter names (no conversion)
  - Add `[key: string]: unknown` to request interfaces
  - Include `@see` links to official documentation
  - Support dynamic parameters via `allowUnknownOption()`
