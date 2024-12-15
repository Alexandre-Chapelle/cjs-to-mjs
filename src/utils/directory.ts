import * as fs from "fs";
import * as path from "path";

import type { SupportedFileExtensions } from "../types";
import { logger } from "../config";
import { convertToEsm, convertToTs, convertToCjs } from "./modules";

const convertFeatureMapper: Record<
  SupportedFileExtensions,
  (filePath: string) => string
> = {
  mjs: convertToEsm,
  ts: convertToTs,
  js: convertToCjs, // TODO: Key should be CJS
};

async function renameFile(
  filePath: string,
  fileName: string,
  content: string,
  originalContent: string,
  convertTo: SupportedFileExtensions,
  loggingEnabled: boolean
): Promise<void> {
  if (content !== originalContent) {
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
  convertTo: SupportedFileExtensions
) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryName = entry.name;
    const fullPath = path.join(dirPath, entryName);

    if (entry.isDirectory()) {
      await traverseDirectory(fullPath, loggingEnabled, fileRegex, convertTo);
    } else if (entry.isFile() && fileRegex.test(entryName)) {
      if (loggingEnabled) console.log(`Processing file: ${fullPath}`);

      try {
        const fileContent = await fs.promises.readFile(fullPath, "utf-8");
        const convertFeature = convertFeatureMapper[convertTo];
        const transformedContent = convertFeature(fileContent);

        renameFile(
          fullPath,
          entryName,
          transformedContent,
          fileContent,
          convertTo,
          loggingEnabled
        );
      } catch (error) {
        if (loggingEnabled)
          logger.error(`Error processing file ${fullPath}: ${error}`);
      }
    }
  }
}
