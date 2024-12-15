export type SupportedFileExtensions = "mjs" | "js" | "ts";
type SupportedConvertionOptions = "all";
export type ConvertionTypes = `${
  | SupportedFileExtensions
  | SupportedConvertionOptions}-to-${SupportedFileExtensions}`;

export type SupportedFileExtensionsUppercase =
  Uppercase<SupportedFileExtensions>;

export interface TypedPromptOutput<T> {
  [key: string]: T;
}

export interface ConversionOptions {
  convertFrom: SupportedFileExtensionsUppercase[];
  convertTo: SupportedFileExtensionsUppercase;
  installTypes?: boolean;
  createInterfaces?: boolean;
  addTyping?: boolean;
}
