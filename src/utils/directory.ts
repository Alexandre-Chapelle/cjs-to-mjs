import * as fs from "fs";
import * as path from "path";

import type { SupportedFileExtensions } from "../types";
import { logger } from "../config";
import { convertToEsm, convertToTs, convertToCjs } from "./modules";

const defaultExcludedDirs: Set<string> = new Set([
  "node_modules",
  ".vscode",
  ".git",
  "dist",
  "build",
  "out",
  ".idea",
  ".DS_Store",
]);

const convertFeatureMapper: Record<
  SupportedFileExtensions,
  (filePath: string) => string
> = {
  mjs: convertToEsm,
  ts: convertToTs,
  js: convertToCjs, // TODO: Key should be CJS
};

async function writeNewContentAndRename(
  filePath: string,
  fileName: string,
  content: string,
  originalContent: string,
  convertTo: SupportedFileExtensions,
  loggingEnabled: boolean,
  backupsEnabled: boolean
): Promise<void> {
  if (content !== originalContent) {
    if (backupsEnabled) {
      const backupFilePath = `${filePath}.bak`;
      await fs.promises.writeFile(backupFilePath, originalContent, "utf-8");
      if (loggingEnabled) logger.info(`Backup created: ${backupFilePath}`);
    }

    const pathParts = fileName.split(".");
    const fileExt = pathParts.pop()?.toLowerCase() || "";

    const newFilePath = filePath.replace(
      new RegExp(`\\.${fileExt}$`, "i"),
      `.${convertTo}`
    );
    await fs.promises.writeFile(newFilePath, content, "utf-8");
    await fs.promises.unlink(filePath);
    if (loggingEnabled) logger.info(`Converted and renamed to: ${newFilePath}`);
  } else {
    if (loggingEnabled) logger.warn(`No patterns found. Skipping conversion.`);
  }
}

export async function traverseDirectory(
  dirPath: string,
  loggingEnabled: boolean,
  fileRegex: RegExp,
  convertTo: SupportedFileExtensions,
  backupsEnabled: boolean,
  excludedDirs: Set<string> = defaultExcludedDirs,
  skipHiddenDirs: boolean = true
) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryName = entry.name;
    const fullPath = path.join(dirPath, entryName);

    if (entry.isDirectory()) {
      if (excludedDirs.has(entryName)) {
        if (loggingEnabled)
          logger.info(`Skipping excluded directory: ${fullPath}`);
        continue;
      }

      if (entryName.startsWith(".") && skipHiddenDirs) {
        if (loggingEnabled)
          logger.info(`Skipping hidden directory: ${fullPath}`);
        continue;
      }

      await traverseDirectory(
        fullPath,
        loggingEnabled,
        fileRegex,
        convertTo,
        backupsEnabled,
        excludedDirs,
        skipHiddenDirs
      );
    } else if (entry.isFile() && fileRegex.test(entryName)) {
      if (loggingEnabled) logger.info(`Processing file: ${fullPath}`);

      try {
        const fileContent = await fs.promises.readFile(fullPath, "utf-8");
        const convertFeature = convertFeatureMapper[convertTo];
        const transformedContent = convertFeature(fileContent);

        writeNewContentAndRename(
          fullPath,
          entryName,
          transformedContent,
          fileContent,
          convertTo,
          loggingEnabled,
          backupsEnabled
        );
      } catch (error) {
        if (loggingEnabled)
          logger.error(`Error processing file ${fullPath}: ${error}`);
      }
    }
  }
}

export async function findFile(
  dirPath: string,
  targetFileName: string,
  loggingEnabled: boolean
): Promise<string | null> {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryName = entry.name;
    const fullPath = path.join(dirPath, entryName);

    if (entry.isDirectory()) findFile(fullPath, targetFileName, loggingEnabled);
    else if (entry.isFile() && entryName === targetFileName) {
      return fullPath;
    }
  }

  return null;
}
