import fs from "fs/promises";
import { google } from "googleapis";
import prettier from "prettier";

const API_KEY = "TODO";
const SPREADSHEET_ID = "TODO";

const sheets = google.sheets({
  version: "v4",
  auth: API_KEY,
});

/**
 * https://www.i18next.com/translation-function/plurals
 */
const PLURAL_EXTENSIONS = ["zero", "one", "two", "few", "many", "other"];

async function generateTranslations() {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Web!A1:C10000",
  });

  if (!data?.values) return;

  const rawValues = data.values as string[][];
  const languages = rawValues[0].slice(1); // index 0 is the "key" property
  const values = rawValues.slice(2).sort((a, b) => a[0].localeCompare(b[0]));
  const pluralKeys: string[] = [];

  // create key type
  let content = "export type TranslationKey =";
  for (const value of values) {
    const [key] = value;
    const hasPluralExtension = PLURAL_EXTENSIONS.some((extension) =>
      key.endsWith(`_${extension}`)
    );

    if (hasPluralExtension) {
      const keyWithoutExtension = key.substring(0, key.lastIndexOf("_"));

      if (!pluralKeys.includes(keyWithoutExtension)) {
        content += `\n  | "${keyWithoutExtension}"`;
        pluralKeys.push(keyWithoutExtension);
      }
    } else {
      content += `\n  | "${key}"`;
    }
  }

  content += ";\n";
  content = await prettier.format(content, { parser: "typescript" });

  await fs.writeFile("src/Translation/translations.ts", content);

  for (const [languageIndex, language] of languages.entries()) {
    const json: Record<string, string> = {};

    for (const value of values) {
      json[value[0]] = value[languageIndex + 1];
    }

    await fs.writeFile(
      `public/locales/${language}/common.json`,
      JSON.stringify(json, null, 2) + "\n"
    );
  }

  console.log("Generating translations succeeded.");
}

generateTranslations().catch((err) => {
  console.error(err);
  process.exit(1);
});
