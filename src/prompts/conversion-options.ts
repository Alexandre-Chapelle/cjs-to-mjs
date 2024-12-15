import inquirer from "inquirer";
import type {
  SupportedFileExtensions,
  SupportedFileExtensionsUppercase,
  ConversionOptions,
} from "../types";

const SUPPORTED_CONVERTION_FILE_EXTENSIONS: SupportedFileExtensions[] = [
  "js",
  "mjs",
  "ts",
];

const mappedSupportedFileExts: { value: SupportedFileExtensionsUppercase }[] =
  SUPPORTED_CONVERTION_FILE_EXTENSIONS.map((ext) => {
    return { value: ext.toUpperCase() as SupportedFileExtensionsUppercase };
  });

export async function getConversionOptions(): Promise<ConversionOptions> {
  const totalExtensions = mappedSupportedFileExts.length;

  const { convertFrom }: { convertFrom: SupportedFileExtensionsUppercase[] } =
    await inquirer.prompt([
      {
        type: "checkbox",
        name: "convertFrom",
        message: "Which files do you want to convert?",
        choices: mappedSupportedFileExts,
        validate: (input) => {
          if (input.length > totalExtensions - 1) {
            return `You can select a maximum of ${
              totalExtensions - 1
            } options.`;
          }
          if (input.length === 0) {
            return "You must select at least one file extension to convert from.";
          }
          return true;
        },
      },
    ]);

  const remainingExtensions = mappedSupportedFileExts.filter(
    (ext) => !convertFrom.includes(ext.value)
  );

  if (remainingExtensions.length === 0) {
    throw new Error(
      "No available file extensions to convert to. Please select fewer options to convert from."
    );
  }

  const { convertTo }: { convertTo: SupportedFileExtensionsUppercase } =
    await inquirer.prompt([
      {
        type: "list",
        name: "convertTo",
        message: "Which format do you want to transform to?",
        choices: remainingExtensions,
      },
    ]);

  const conversionOptions: ConversionOptions = {
    convertFrom,
    convertTo,
  };

  if (convertTo === "TS") {
    const additionalQuestions = await inquirer.prompt([
      {
        type: "confirm",
        name: "installTypes",
        message:
          "Do you want me to automatically install types for your project (from package.json)?",
        default: false,
      },
      // {
      //   type: "confirm",
      //   name: "createInterfaces",
      //   message: "Do you want me to create class interfaces for you?",
      //   default: false,
      // },
      // {
      //   type: "confirm",
      //   name: "addTyping",
      //   message: "Do you want me to try to add typing to your modules?",
      //   default: false,
      // },
    ]);

    Object.assign(conversionOptions, additionalQuestions);
  }

  return conversionOptions;
}
