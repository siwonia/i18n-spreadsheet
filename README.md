# i18n Spreadsheet

## Installation

```
npm i i18n-spreadsheet --save-dev
yarn add i18n-spreadsheet -D
```

## Setup

Add script to your `package.json`:

```json
{
  "scripts": {
    ...
    "translations": "API_KEY=foo SPREADSHEET_ID=bar TYPE_FILE=../../src/translations.ts TRANSLATION_FILE=../../locales/{LANGUAGE_CODE}/common.json npm run --prefix node_modules/i18n-spreadsheet generate-translations",
    "unused-translations": "DIRECTORY_PATH=../../src TYPE_FILE=../../src/translations.ts npm run --prefix ../node_modules/i18n-spreadsheet find-unused-translations",
  },
  ...
}
```

## Run

```
npm run translations
```
