import * as fs from "fs";
import * as path from "path";

import { CJS_FILE_REGEX, convertCjsToEsm } from "./modules";

export async function traverseDirectory(
  dirPath: string,
  loggingEnabled: boolean
) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await traverseDirectory(fullPath, loggingEnabled);
    } else if (entry.isFile() && CJS_FILE_REGEX.test(entry.name)) {
      if (loggingEnabled) console.log(`Processing file: ${fullPath}`);

      try {
        const fileContent = await fs.promises.readFile(fullPath, "utf-8");
        const transformedContent = convertCjsToEsm(fileContent);

        if (transformedContent !== fileContent) {
          const newFilePath = fullPath.replace(/\.js$/i, ".ts");
          await fs.promises.writeFile(newFilePath, transformedContent, "utf-8");
          await fs.promises.unlink(fullPath);
          if (loggingEnabled)
            console.log(`Converted and renamed to: ${newFilePath}`);
        } else {
          if (loggingEnabled)
            console.log("No CommonJS patterns found. Skipping conversion.");
        }
      } catch (error) {
        if (loggingEnabled)
          console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  }
}
