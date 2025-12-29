<div align="center">
  <img src="assets/icon.png" alt="rustore CLI" width="128" height="128">
  <h1>rustore<br>CLI for RuStore API</h1>
  <p>Command-line interface for interacting with RuStore API</p>
  <p>
    <a href="README.en.md">English</a> | <a href="README.md">Русский</a>
  </p>
</div>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## 🌟 Features

- 🔐 Authentication via private key from RuStore Console
- 🔑 Automatic access token management
- 📦 Work with RuStore API (payments, subscriptions, applications)
- 📄 JSON output format (`--json`) for convenient integration and processing
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

### Using via npx (without installation)

You can use the CLI without installation via `npx`:

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

Before using the CLI, you need to obtain a private key from [RuStore Console](https://console.rustore.ru/sign-in).

### Authentication

```sh
# Authentication with keyId and private key
rustore login --key-id <keyId> --key <base64-key>

# Or short form
rustore login -i <keyId> -k <base64-key>
```

**Example:**

```sh
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
```

### Check Status

```sh
# Show information about current authentication
rustore whoami
```

### Logout

```sh
# Remove token (keys remain in config)
rustore logout
```

### Working with Applications

```sh
# Get list of applications
rustore apps list

# Get all applications (with pagination)
rustore apps list --all

# Output result in JSON format (convenient for scripts and integrations)
rustore apps list --json

# Combining options: get all applications in JSON format
rustore apps list --all --json

# Filtering with JSON output
rustore apps list --app-name "MyApp" --json
rustore apps list --app-status PUBLISHED --json

# Create draft version of application
rustore apps create-draft --app-id 123456 --version-name "1.0.0" --version-code 1

# Create draft version with JSON output
rustore apps create-draft --app-id 123456 --version-name "2.0.0" --version-code 2 --json

# Upload APK file for version (is-main-apk is required)
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true

# Upload APK file with Huawei Mobile Services
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk false --services-type HMS

# Upload APK file with JSON output
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true --json
```

### Working with Feedback

```sh
# Get application feedback
rustore feedback list --package-name com.example.app

# Get all feedback (with pagination)
rustore feedback list --package-name com.example.app --all

# Get feedback in JSON format
rustore feedback list --package-name com.example.app --json

# Leave a response to feedback
rustore feedback answer --package-name com.example.app --comment-id 123456 --text "Thank you for your feedback!"

# Get feedback response status
rustore feedback status --package-name com.example.app --feedback-id 789

# Get all feedback responses
rustore feedback status --package-name com.example.app

# Update feedback response
rustore feedback update --package-name com.example.app --feedback-id 789 --text "Updated response"

# Delete feedback response
rustore feedback delete --package-name com.example.app --feedback-id 789
```

**💡 Tip:** The `--json` flag is useful for:

- Automation and scripts
- Integration with other tools
- Data processing via `jq` or other JSON parsers
- Saving results to file: `rustore apps list --json > apps.json`

## 📁 Configuration

The CLI saves configuration in `~/.rustore/config.json`:

```json
{
  "keyId": "your-key-id",
  "privateKey": "your-private-key-base64",
  "token": "jwe-token",
  "tokenExpiresAt": 1234567890
}
```

## 🔧 Development

### Installing Dependencies

```sh
npm install
```

### Building

```sh
npm run build
```

### Running in Development Mode

```sh
npm start
```

### Testing

```sh
# Run all tests
npm test

# Tests in watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

#### How to Test Current Changes

1. **Build the project:**

   ```sh
   npm run build
   ```

2. **Type checking:**

   ```sh
   npm run type-check
   # or
   ./node_modules/.bin/tsc --noEmit
   ```

3. **Run tests:**

   ```sh
   npm test
   ```

4. **Test CLI locally:**

   ```sh
   # Run without installation (via tsx)
   npm start -- login <keyId> --key <key>

   # Or after build
   node dist/bin.js whoami
   ```

5. **Linting:**
   ```sh
   npm run lint
   npm run lint:fix
   ```

### Type Checking

```sh
npm run type-check
```

### Linting

```sh
npm run lint
npm run lint:fix
```

## 📚 API

### API Structure

The API is organized by categories, as in RuStore documentation:

- **Apps API** (`appsApi`) - Application upload and publication (general methods)
- **Payments API** (`paymentsApi`) - Working with payments and subscriptions (general methods)
- **Payments App API** (`paymentsAppApi`) - Working with payments and subscriptions (application methods)
- **Catalog API** (`catalogApi`) - Product catalog API
- **Feedback API** (`feedbackApi`) - Working with application feedback

### Programmatic Access

```typescript
import {login, appsApi, paymentsApi, catalogApi, feedbackApi} from 'rustore';

// Authentication
await login('keyId', 'privateKey');

// Get list of applications
const appsResponse = await appsApi.getAppList();
console.log(appsResponse.body.content);

// Get all applications (with automatic pagination)
const allApps = await appsApi.getAllApps();

// Create draft version of application
const draftVersion = await appsApi.createDraftVersion(123456, {
  versionName: '1.0.0',
  versionCode: 1,
});

// Upload APK file for version
const uploadResult = await appsApi.uploadApkFile(
  'com.example.app', // packageName instead of appId
  draftVersion.body?.versionId || 789,
  './app-release.apk',
  {
    isMainApk: true, // required parameter
    servicesType: 'Unknown', // optional: 'HMS' or 'Unknown'
  },
);

// Get application feedback
const feedbackResponse = await feedbackApi.getFeedback('com.example.app');

// Leave a response to feedback
const answerResponse = await feedbackApi.createFeedbackAnswer('com.example.app', 123456, {
  text: 'Thank you for your feedback!',
});

// Get feedback response status
const statusResponse = await feedbackApi.getFeedbackAnswerStatus('com.example.app', 789);

// Using other API categories
// await paymentsApi.refund(...);
// await catalogApi.getProducts(...);
```

## 🔗 Useful Links

- [RuStore API Documentation](https://www.rustore.ru/help/en/work-with-rustore-api)
- [Authorization Process](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token)
- [RuStore Console](https://console.rustore.ru/sign-in)

## 📝 License

MIT

[package-name]: rustore
[npm-url]: https://www.npmjs.com/package/rustore
[npm-image]: https://img.shields.io/npm/v/rustore
[github-license]: https://img.shields.io/github/license/romankurnovskii/rustore
[github-license-url]: https://github.com/romankurnovskii/rustore/blob/main/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/rustore
