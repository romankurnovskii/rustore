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
| Upload AAB File           | POST `/public/v1/application/{packageName}/version/{versionId}/aab`    | ❌     | Not implemented                             |
| Send Draft for Moderation | POST `/public/v1/application/{packageName}/version/{versionId}/commit` | ✅ 🧪  | Implemented and tested in `src/api/apps.ts` |
| Get App Tag List          | GET `/public/v1/application/tag`                                       | ❌     | Not implemented                             |
| Update Draft Version      | PUT `/public/v1/application/{packageName}/version/{versionId}`         | ❌     | Not implemented                             |
| Delete Draft Version      | DELETE `/public/v1/application/{packageName}/version/{versionId}`      | ❌     | Not implemented                             |
| Get Version Info          | GET `/public/v1/application/{packageName}/version/{versionId}`         | ❌     | Not implemented                             |
| Get Version List          | GET `/public/v1/application/{packageName}/version`                     | ❌     | Not implemented                             |

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
| Get Payment           | GET `/public/v1/payment/{paymentId}`                   | ❌     | Not implemented |
| Get Subscription      | GET `/public/v1/subscription/{subscriptionId}`         | ❌     | Not implemented |
| Cancel Subscription   | POST `/public/v1/subscription/{subscriptionId}/cancel` | ❌     | Not implemented |
| Get Subscription List | GET `/public/v1/subscription`                          | ❌     | Not implemented |

### 5. Payments & Subscriptions App (Платежи и подписки - методы приложений)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-payments-subscriptions-app`

| Endpoint          | Method                                                           | Status | Notes           |
| ----------------- | ---------------------------------------------------------------- | ------ | --------------- |
| Get Invoices      | GET `/public/v1/application/{packageName}/invoice`               | ❌     | Not implemented |
| Confirm Purchase  | POST `/public/v1/application/{packageName}/purchase/confirm`     | ❌     | Not implemented |
| Cancel Purchase   | POST `/public/v1/application/{packageName}/purchase/cancel`      | ❌     | Not implemented |
| Get Purchase      | GET `/public/v1/application/{packageName}/purchase/{purchaseId}` | ❌     | Not implemented |
| Get Purchase List | GET `/public/v1/application/{packageName}/purchase`              | ❌     | Not implemented |

### 6. Catalog (Продуктовый каталог)

**Base URL**: `https://www.rustore.ru/help/work-with-rustore-api/api-catalog`

| Endpoint       | Method                                          | Status | Notes           |
| -------------- | ----------------------------------------------- | ------ | --------------- |
| Get Products   | GET `/public/v1/catalog/product`                | ❌     | Not implemented |
| Get Product    | GET `/public/v1/catalog/product/{productId}`    | ❌     | Not implemented |
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
6. ❌ Get Version Info (to check version status)
7. ❌ Update Draft Version (to modify draft before submission)

### Medium Priority (Useful Features)

1. ❌ Get App Tag List (needed for create-draft with seoTagIds)
2. ❌ Get Version List (to see all versions)
3. ❌ Delete Draft Version (cleanup)
4. ❌ Get Payment/Subscription info (for financial operations)

### Low Priority (Nice to Have)

1. ❌ All Payments endpoints
2. ❌ All Catalog endpoints
3. ❌ Advanced version management

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
