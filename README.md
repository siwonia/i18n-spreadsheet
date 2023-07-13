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
    "translations": "API_KEY=foo SPREADSHEET_ID=bar npm run --prefix node_modules/i18n-spreadsheet generate-translations",
  },
  ...
}
```

## Run

```
npm run translations
```
