import { getDirectory, getOptions } from "./prompts";
import { traverseDirectory } from "./utils";

async function start() {
  const targetDir = await getDirectory();
  const { backupsEnabled, loggingEnabled } = await getOptions();
  if (loggingEnabled)
    console.log(`Starting conversion in directory: ${targetDir}`);

  await traverseDirectory(targetDir, loggingEnabled);

  if (loggingEnabled) console.log("Conversion completed.");
}

async function main() {
  start();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
