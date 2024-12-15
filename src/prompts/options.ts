import inquirer from "inquirer";

export async function getOptions(): Promise<{
  backupsEnabled: boolean;
  loggingEnabled: boolean;
}> {
  const { backupsEnabled, loggingEnabled } = await inquirer.prompt([
    {
      type: "confirm",
      name: "backupsEnabled",
      message: "Do you want to create backups for each modified file?",
      default: false,
    },
    {
      type: "confirm",
      name: "loggingEnabled",
      message: "Do you want to enable logging?",
      default: true,
    },
  ]);

  return { backupsEnabled, loggingEnabled };
}
