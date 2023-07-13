import fs from "fs";
import path from "path";

function getFilesInDirectory(directory: string): string[] {
  const fileContents: string[] = [];

  const traverseDirectory = (dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (filePath === translationsPath) return;
      const fileStat = fs.statSync(filePath);

      if (fileStat.isFile()) {
        const content = fs.readFileSync(filePath, "utf-8");
        fileContents.push(content);
      } else if (fileStat.isDirectory()) {
        traverseDirectory(filePath);
      }
    });
  };

  traverseDirectory(directory);

  return fileContents;
}

const directoryPath = `${__dirname.split("/").slice(0, -1).join("/")}/src`;
const translationsPath = `${directoryPath}/Translation/translations.ts`;
const translationsContent = fs.readFileSync(translationsPath, "utf-8");

const translationsContentLines = translationsContent
  .split("\n")
  // Remove first line: `export type TranslationKey =`
  .slice(1)
  // Remove last line: empty line
  .slice(0, -1);

const translationKeys = translationsContentLines.map((translation, index) =>
  translation
    // Remove leading code: `  | "`
    .slice(5)
    // Remove trailing code: `"`, or `";` for the last translation
    .slice(0, index === translationsContentLines.length - 1 ? -2 : -1)
);

const fileContents = getFilesInDirectory(directoryPath);

translationKeys.forEach((translationKey) => {
  const isTranslationKeyInFile = fileContents.some((fileContent) =>
    fileContent.includes(translationKey)
  );

  if (!isTranslationKeyInFile) {
    console.log(translationKey);
  }
});
