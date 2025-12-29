<div align="center">
  <img src="../../assets/icon.png" alt="rustore CLI" width="128" height="128">
  <h1>rustore<br>RuStore API के लिए CLI</h1>
  <p>RuStore API के साथ इंटरैक्ट करने के लिए कमांड लाइन इंटरफेस</p>
  <p>
    <a href="README.en.md">English</a> | <a href="../../README.md">Русский</a> | <a href="README.hi.md">हिंदी</a> | <a href="README.zh.md">中文</a>
  </p>
</div>

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## 🌟 विशेषताएँ

- 🔐 RuStore कंसोल से निजी कुंजी (private key) के माध्यम से प्रमाणीकरण
- 🔑 एक्सेस टोकन का स्वचालित प्रबंधन
- 📦 RuStore API के साथ कार्य (भुगतान, सदस्यता, ऐप्स)
- 📄 आसान एकीकरण और डेटा प्रोसेसिंग के लिए JSON प्रारूप (`--json`) में परिणाम
- ⚙️ कॉन्फ़िगरेशन को `~/.rustore/config.json` में सहेजना
- 🧪 पूर्ण परीक्षण कवरेज (Test coverage)

## 🛠️ इंस्टॉलेशन (Installation)

### ग्लोबल इंस्टॉलेशन

```sh
npm install -g rustore
```

इंस्टॉल करने के बाद, निम्न कमांड का उपयोग करें:

```sh
rustore --help

```

### npx के माध्यम से उपयोग (बिना इंस्टॉल किए)

आप `npx` के माध्यम से बिना इंस्टॉल किए CLI का उपयोग कर सकते हैं:

```sh
npx rustore --help
npx rustore login --key-id <keyId> --key <privateKey>
npx rustore apps list
```

### स्थानीय इंस्टॉलेशन (Local)

```sh
npm install rustore
```

## 📖 उपयोग (Usage)

### प्रारंभिक सेटअप

CLI का उपयोग करने से पहले, आपको [RuStore कंसोल](https://console.rustore.ru/sign-in) से एक निजी कुंजी (Private Key) प्राप्त करनी होगी।

### प्रमाणीकरण (Authorization)

```sh
# keyId और निजी कुंजी के साथ प्रमाणीकरण
rustore login --key-id <keyId> --key <base64-key>

# या संक्षिप्त रूप
rustore login -i <keyId> -k <base64-key>

```

**उदाहरण:**

```sh
rustore login --key-id 123456 --key MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...

```

### स्थिति की जाँच (Check Status)

```sh
# वर्तमान प्रमाणीकरण के बारे में जानकारी दिखाएं
rustore whoami
```

### लॉग आउट

```sh
# टोकन हटा दें (कुंजियाँ कॉन्फ़िगरेशन में रहती हैं)
rustore logout

```

### ऐप्स के साथ कार्य

```sh
# ऐप्स की सूची प्राप्त करें
rustore apps list

# सभी ऐप्स प्राप्त करें (पेजिनेशन के साथ)
rustore apps list --all

# परिणाम JSON प्रारूप में प्राप्त करें (स्क्रिप्ट के लिए उपयोगी)
rustore apps list --json

# सभी ऐप्स JSON प्रारूप में प्राप्त करें
rustore apps list --all --json

# JSON आउटपुट के साथ फ़िल्टर करें
rustore apps list --app-name "MyApp" --json
rustore apps list --app-status PUBLISHED --json

# ऐप का मसौदा संस्करण (Draft Version) बनाएँ
rustore apps create-draft --app-id 123456 --version-name "1.0.0" --version-code 1

# JSON आउटपुट के साथ मसौदा संस्करण बनाएँ
rustore apps create-draft --app-id 123456 --version-name "2.0.0" --version-code 2 --json

# संस्करण के लिए APK फ़ाइल अपलोड करें (is-main-apk अनिवार्य है)
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk true

# Huawei Mobile Services के साथ APK अपलोड करें
rustore apps upload-apk --package-name com.example.app --version-id 789 --file ./app-release.apk --is-main-apk false --services-type HMS
```

### प्रतिक्रिया और समीक्षाएँ (Feedback)

```sh
# ऐप की प्रतिक्रिया (Reviews) प्राप्त करें
rustore feedback list --package-name com.example.app

# सभी प्रतिक्रियाएं प्राप्त करें
rustore feedback list --package-name com.example.app --all

# JSON प्रारूप में प्रतिक्रिया प्राप्त करें
rustore feedback list --package-name com.example.app --json

# प्रतिक्रिया का उत्तर दें
rustore feedback answer --package-name com.example.app --comment-id 123456 --text "प्रतिक्रिया के लिए धन्यवाद!"

# उत्तर की स्थिति प्राप्त करें
rustore feedback status --package-name com.example.app --feedback-id 789

# उत्तर अपडेट करें (Update)
rustore feedback update --package-name com.example.app --feedback-id 789 --text "अपडेट किया गया उत्तर"

# उत्तर हटा दें (Delete)
rustore feedback delete --package-name com.example.app --feedback-id 789

```

**💡 सुझाव:** `--json` फ्लैग इनके लिए उपयोगी है:

- स्वचालन (Automation) और स्क्रिप्ट्स
- अन्य टूल्स के साथ एकीकरण
- `jq` या अन्य JSON पार्सर के माध्यम से डेटा प्रोसेसिंग

## 📁 कॉन्फ़िगरेशन (Configuration)

CLI कॉन्फ़िगरेशन को `~/.rustore/config.json` में सहेजता है:

```json
{
  "keyId": "आपका-key-id",
  "privateKey": "आपकी-निजी-कुंजी-base64",
  "token": "jwe-टोकन",
  "tokenExpiresAt": 1234567890
}
```

## 🔗 उपयोगी लिंक

- [RuStore API दस्तावेज़](https://www.rustore.ru/help/en/work-with-rustore-api)
- [प्रमाणीकरण प्रक्रिया](https://www.rustore.ru/help/work-with-rustore-api/api-authorization-token)
- [RuStore कंसोल](https://console.rustore.ru/sign-in)
- [APK को प्रोडक्शन में सबमिट करने का तरीका](../how-to-submit-apk-for-production.md)

## 📋 API कार्यान्वयन स्थिति

API endpoints के कार्यान्वयन स्थिति के बारे में विस्तृत जानकारी के लिए, [TODO_API_ENDPOINTS.md](../TODO_API_ENDPOINTS.md) या [मुख्य README](../../README.md#-todo-api-endpoints-implementation-status) देखें।
