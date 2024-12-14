import inquirer from "inquirer";

export async function getConversion(): Promise<boolean> {
  const { convertToTypescript } = await inquirer.prompt([
    {
      type: "confirm",
      name: "convertToTypescript",
      message: "Do you want to convert JavaScript to Typescript?",
      default: true,
    },
  ]);

  if (!convertToTypescript) return false;

  // Options for typescript conversion WIP
  // - Add 'public' to methods
  // - Add class implementations
  // - Add type imports if possible. E.g: import {Request} from 'express' if such signature is found in the class
  // - Analyz package.json and install types for each dependency
  // ...

  return convertToTypescript;
}
