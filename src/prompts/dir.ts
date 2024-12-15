import inquirer from "inquirer";
import * as path from "path";
import * as fs from "fs";

export async function getDirectory(): Promise<string> {
  const { hasScss } = await inquirer.prompt([
    {
      type: "confirm",
      name: "hasScss",
      message: "Are target files in this directory?",
      default: true,
    },
  ]);

  if (hasScss) {
    return process.cwd();
  } else {
    const { dir } = await inquirer.prompt([
      {
        type: "input",
        name: "dir",
        message: "Please provide the directory path:",
        validate: (input: string) => {
          if (fs.existsSync(input) && fs.lstatSync(input).isDirectory()) {
            return true;
          }
          return "Please provide a valid directory path.";
        },
      },
    ]);
    return path.resolve(dir);
  }
}
