<div align="center">
  <img src="../../assets/icon.png" alt="rustore CLI" width="128" height="128">
  <h1>rustore<br>CLI for RuStore API</h1>
  <p>Command Line Interface for interacting with the RuStore API</p>
  <p>
    <a href="README.en.md">English</a> | <a href="../../README.md">Русский</a> | <a href="README.hi.md">हिंदी</a> | <a href="README.zh.md">中文</a>
  </p>
</div>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## 🌟 Features

- 🔐 Authorization via private key from RuStore Console
- 🔑 Automatic access token management
- 📦 Interact with RuStore API (payments, subscriptions, apps)
- 📄 JSON output support (`--json`) for easy integration and parsing
- ⚙️ Configuration saved in `~/.rustore/config.json`
- 🧪 Full test coverage

## 🛠️ Installation

### Global Installation

```sh
npm install -g rustore
```

After installation, use the command:

```sh
rustore --help
```

### Usage via npx (without installation)

You can use the CLI without installing it via `npx`:

```sh
npx rustore --help
npx rustore login --key-id <keyId> --key <privateKey>
npx rustore apps list
```

### Local Installation

```sh
npm install rustore
```

## 📖 Usage

### Initial Setup

Before using the CLI, you must obtain a private key from the [RuStore Console](https://console.rustore.ru/sign-in).

### Authorization

The `keyId` parameter is the **numeric key ID** from the keys table in [RuStore Console](https://console.rustore.ru/sign-in) (Company or Developer tab). Use the key ID, not the key name. See [Authorization token](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token).

```sh
# Authorization using keyId and private key
rustore login --key-id <keyId> --key <base64-key>

# Or short form
rustore login -i <keyId> -k <base64-key>

```

**Example (keyId is the numeric ID from the console, e.g. 1275328):**

```sh
rustore login --key-id 1275328 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...

```

If you get "Invalid request format. Unexpected value", ensure you pass the **numeric key ID**, not the key name (e.g. use the ID from the keys table, not a name like `dev-03-all`).

### Check Status

```sh
# Show information about current authorization
rustore whoami

```

### Logout

```sh
# Remove token (keys remain in config)
rustore logout

```

### App Management

```sh
# Get list of applications
rustore apps list

# Get all applications (with pagination)
rustore apps list --all

# Output result in JSON format (useful for scripts)
rustore apps list --json

# Combine options: get all apps in JSON format
rustore apps list --all --json

# Filter with JSON output
rustore apps list --app-name "MyApp" --json
rustore apps list --app-status PUBLISHED --json

# Create a draft version of the app
rustore apps create-draft --app-id 123456 --version-name "1.0.0" --version-code 1

# Create a draft version with JSON output
rustore apps create-draft --app-id 123456 --version-name "2.0.0" --version-code 2 --json

# Upload APK file for a version (is-main-apk is required)
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true

# Upload APK file with Huawei Mobile Services
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk false --services-type HMS

# Upload APK file with JSON output
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true --json

```

### Feedback & Reviews

```sh
# Get app feedback/reviews
rustore feedback list --package-name com.example.app

# Get all reviews (with pagination)
rustore feedback list --package-name com.example.app --all

# Get reviews in JSON format
rustore feedback list --package-name com.example.app --json

# Reply to a review
rustore feedback answer --package-name com.example.app --comment-id 123456 --text "Thanks for your feedback!"

# Get status of a reply
rustore feedback status --package-name com.example.app --feedback-id 789

# Get all reply statuses
rustore feedback status --package-name com.example.app

# Update a reply
rustore feedback update --package-name com.example.app --feedback-id 789 --text "Updated reply"

# Delete a reply
rustore feedback delete --package-name com.example.app --feedback-id 789

```

**💡 Tip:** The `--json` flag is useful for:

- Automation and scripts
- Integration with other tools
- Data processing via `jq` or other JSON parsers
- Saving results to a file: `rustore apps list --json > apps.json`

## 📁 Configuration

The CLI saves configuration to `~/.rustore/config.json`:

```json
{
  "keyId": "your-key-id",
  "privateKey": "your-private-key-base64",
  "token": "jwe-token",
  "tokenExpiresAt": 1234567890
}
```

## 📚 API

### Programmatic Access

```typescript
import {login, appsApi, paymentsApi, catalogApi, feedbackApi} from 'rustore';

// Authorization
await login('keyId', 'privateKey');

// Get list of apps
const appsResponse = await appsApi.getAppList();
console.log(appsResponse.body.content);

// Create a draft version
const draftVersion = await appsApi.createDraftVersion(123456, {
  versionName: '1.0.0',
  versionCode: 1,
});
```

## 🔗 Useful Links

- [RuStore API Documentation](https://www.rustore.ru/help/en/work-with-rustore-api)
- [Authorization Process](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token)
- [RuStore Console](https://console.rustore.ru/sign-in)
- [How to Submit APK for Production](../how-to-submit-apk-for-production.md)

## 📋 API Implementation Status

For detailed information about API endpoints implementation status, see [TODO_API_ENDPOINTS.md](../TODO_API_ENDPOINTS.md) or the [main README](../../README.md#-todo-api-endpoints-implementation-status).
