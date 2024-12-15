import { logger } from "../../config";
import { findFile } from "../";
import * as fs from "fs";
import { exec } from "child_process";

function execPromise(command: string, path: string) {
  return new Promise(function (resolve, reject) {
    exec(command, { cwd: path }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout.trim());
    });
  });
}

const formatDependecyObjToTypesArr = (
  obj: Record<string, string> | undefined,
  name: string,
  loggingEnabled: boolean
): Array<string> => {
  const typesArr = [];

  if (!obj) {
    if (loggingEnabled) logger.warn(`${name} not found in package.json`);
    return [];
  }

  for (const key of Object.keys(obj)) {
    if (key.includes("@types/")) continue;

    if (key.startsWith("@")) {
      const scopedName = key.slice(1).replace("/", "__");
      typesArr.push(`@types/${scopedName}`);
    } else typesArr.push(`@types/${key}`);
  }

  return typesArr.filter(Boolean);
};

export async function instalTypescriptTypes(
  dirPath: string,
  loggingEnabled: boolean
) {
  const targetFileName = "package.json";

  if (loggingEnabled) logger.info("Searching for package.json...");
  const filePath = await findFile(dirPath, targetFileName, loggingEnabled);
  if (!filePath) {
    logger.error(
      "package.json was not found, hence I can't install types for your project"
    );

    return;
  }

  const foundDirArr = filePath.split("\\").filter(Boolean);
  foundDirArr.pop();
  const foundDirPath = foundDirArr.join("/");

  if (loggingEnabled) logger.info(`${targetFileName} found @ ${filePath}`);

  const parsedJson = await fs.promises
    .readFile(filePath, {
      encoding: "utf-8",
    })
    .then((content) => JSON.parse(content));

  const dependencies = formatDependecyObjToTypesArr(
    parsedJson["dependencies"],
    "dependencies",
    loggingEnabled
  );

  const devDependencies = formatDependecyObjToTypesArr(
    parsedJson["devDependencies"],
    "devDependencies",
    loggingEnabled
  );

  const peerDependencies = formatDependecyObjToTypesArr(
    parsedJson["peerDependencies"],
    "peerDependencies",
    loggingEnabled
  );

  const typesArr = [...dependencies, ...devDependencies, ...peerDependencies];

  const uniqueTypesArr = Array.from(new Set(typesArr));
  if (uniqueTypesArr.length === 0) {
    if (loggingEnabled) logger.info("No @types packages to install.");
    return;
  }

  if (loggingEnabled) logger.info(`Installing types...`);

  const successfullyInstalled: string[] = [];
  const failedToInstall: string[] = [];

  for (const typePackage of uniqueTypesArr) {
    try {
      if (loggingEnabled) logger.info(`Installing ${typePackage}...`);

      // TODO: Either use https://github.com/jeffijoe/typesync
      // or add cross-platform implementation, and a way to check
      // types url for package and install
      await execPromise(`npm install --save-dev ${typePackage}`, foundDirPath);

      successfullyInstalled.push(typePackage);
      if (loggingEnabled) logger.success(`Installed ${typePackage}`);
    } catch (error: any) {
      if (
        error.stderr &&
        error.stderr.includes("404") &&
        error.stderr.includes("Not Found")
      ) {
        logger.warn(`Type definitions for ${typePackage} not found. Skipping.`);
      }
      failedToInstall.push(typePackage);
    }
  }

  if (loggingEnabled) {
    if (successfullyInstalled.length > 0) {
      logger.success(
        `Successfully installed ${
          successfullyInstalled.length
        } types for: ${successfullyInstalled.join(", ")}`
      );
    }
    if (failedToInstall.length > 0) {
      logger.warn(`Failed to install types for: ${failedToInstall.join(", ")}`);
    }
  }
}
