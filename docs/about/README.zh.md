<div align="center">
  <img src="../../assets/icon.png" alt="rustore CLI" width="128" height="128">
  <h1>rustore<br>RuStore API 命令行工具</h1>
  <p>用于与 RuStore API 交互的命令行界面 (CLI)</p>
  <p>
    <a href="README.en.md">English</a> | <a href="../../README.md">Русский</a> | <a href="README.hi.md">हिंदी</a> | <a href="README.zh.md">中文</a>
  </p>
</div>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## 🌟 功能特性

- 🔐 通过 RuStore 控制台的私钥进行身份验证
- 🔑 自动管理访问令牌 (Access Token)
- 📦 支持 RuStore API 操作（支付、订阅、应用管理）
- 📄 支持 JSON 格式输出 (`--json`)，便于集成和处理
- ⚙️ 配置文件保存在 `~/.rustore/config.json`
- 🧪 完整的测试覆盖率

## 🛠️ 安装指南

### 全局安装

```sh
npm install -g rustore
```

安装完成后，使用以下命令：

```sh
rustore --help
```

### 通过 npx 使用（无需安装）

您可以直接通过 `npx` 使用 CLI 而无需安装：

```sh
npx rustore --help
npx rustore login --key-id <keyId> --key <privateKey>
npx rustore apps list
```

### 本地安装

```sh
npm install rustore
```

## 📖 使用指南

### 初始设置

在使用 CLI 之前，您必须从 [RuStore 控制台](https://console.rustore.ru/sign-in) 获取私钥。

### 身份验证 (Authorization)

```sh
# 使用 keyId 和私钥进行登录
rustore login --key-id <keyId> --key <base64-key>

# 或简写形式
rustore login -i <keyId> -k <base64-key>

```

**示例：**

```sh
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
```

### 检查状态

```sh
# 显示当前登录信息
rustore whoami
```

### 退出登录

```sh
# 删除令牌（密钥仍保留在配置中）
rustore logout
```

### 应用管理 (App Management)

```sh
# 获取应用列表
rustore apps list

# 获取所有应用（带分页）
rustore apps list --all

# 以 JSON 格式输出结果（便于脚本处理）
rustore apps list --json

# 组合选项：获取所有应用的 JSON 数据
rustore apps list --all --json

# 过滤并输出 JSON
rustore apps list --app-name "MyApp" --json
rustore apps list --app-status PUBLISHED --json

# 创建应用草稿版本 (Draft Version)
rustore apps create-draft --app-id 123456 --version-name "1.0.0" --version-code 1

# 创建草稿版本并输出 JSON
rustore apps create-draft --app-id 123456 --version-name "2.0.0" --version-code 2 --json

# 上传版本的 APK 文件 (必须指定 is-main-apk)
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true

# 上传包含 Huawei Mobile Services 的 APK
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk false --services-type HMS

# 上传 APK 并输出 JSON
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true --json
```

### 评价与反馈 (Feedback)

```sh
# 获取应用评价
rustore feedback list --package-name com.example.app

# 获取所有评价（带分页）
rustore feedback list --package-name com.example.app --all

# 获取评价的 JSON 数据
rustore feedback list --package-name com.example.app --json

# 回复评价
rustore feedback answer --package-name com.example.app --comment-id 123456 --text "感谢您的反馈！"

# 获取回复状态
rustore feedback status --package-name com.example.app --feedback-id 789

# 获取所有回复状态
rustore feedback status --package-name com.example.app

# 更新回复
rustore feedback update --package-name com.example.app --feedback-id 789 --text "更新后的回复"

# 删除回复
rustore feedback delete --package-name com.example.app --feedback-id 789
```

**💡 提示：** `--json` 参数适用于以下场景：

- 自动化脚本
- 与其他工具集成
- 通过 `jq` 或其他 JSON 解析器处理数据
- 将结果保存到文件：`rustore apps list --json > apps.json`

## 📁 配置 (Configuration)

CLI 将配置保存在 `~/.rustore/config.json`：

```json
{
  "keyId": "您的-key-id",
  "privateKey": "您的-base64-私钥",
  "token": "jwe-令牌",
  "tokenExpiresAt": 1234567890
}
```

## 📚 API 开发

### 编程访问

```typescript
import {login, appsApi, paymentsApi, catalogApi, feedbackApi} from 'rustore';

// 登录
await login('keyId', 'privateKey');

// 获取应用列表
const appsResponse = await appsApi.getAppList();
console.log(appsResponse.body.content);

// 创建草稿版本
const draftVersion = await appsApi.createDraftVersion(123456, {
  versionName: '1.0.0',
  versionCode: 1,
});
```

## 🔗 有用链接

- [RuStore API 文档](https://www.rustore.ru/help/en/work-with-rustore-api)
- [API 授权流程](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token)
- [RuStore 控制台](https://console.rustore.ru/sign-in)
- [如何提交 APK 到生产环境](../how-to-submit-apk-for-production.md)

## 📋 API 实现状态

有关 API 端点实现状态的详细信息，请参阅 [TODO_API_ENDPOINTS.md](../TODO_API_ENDPOINTS.md) 或 [主 README](../../README.md#-todo-api-endpoints-implementation-status)。
