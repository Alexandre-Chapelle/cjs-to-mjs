import { removeAccidentalSemicolons } from "./shared";

export const IMPORT_DEFAULT_REGEX =
  /import\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?/g;
export const IMPORT_NAMED_REGEX =
  /import\s+\{\s*([a-zA-Z0-9_$,\s]*)\s*\}\s+from\s+['"]([^'"]+)['"];?/g;
export const IMPORT_NAMESPACE_REGEX =
  /import\s+\*\s+as\s+([a-zA-Z0-9_$]+)\s+from\s+['"]([^'"]+)['"];?/g;
export const IMPORT_SIDE_EFFECT_REGEX = /import\s+['"]([^'"]+)['"];?/g;

export const EXPORT_DEFAULT_REGEX = /export\s+default\s+(.+);?/g;
export const EXPORT_NAMED_DECLARATION_REGEX =
  /export\s+(const|let|var|function|class)\s+([a-zA-Z0-9_$]+)([\s\S]*?);/g;
export const EXPORT_NAMED_LIST_REGEX =
  /export\s+\{\s*([a-zA-Z0-9_$,\s]*)\s*\};?/g;

export function replaceImportDefault(
  match: string,
  varName: string,
  module: string
): string {
  return `const ${varName} = require('${module}');`;
}

export function replaceImportNamed(
  match: string,
  imports: string,
  module: string
): string {
  return `const { ${imports} } = require('${module}');`;
}

export function replaceImportNamespace(
  match: string,
  varName: string,
  module: string
): string {
  return `const ${varName} = require('${module}');`;
}

export function replaceImportSideEffect(match: string, module: string): string {
  return `require('${module}');`;
}

export function replaceExportDefault(
  match: string,
  expression: string
): string {
  return `module.exports = ${expression};`;
}

export function replaceExportNamedDeclaration(
  match: string,
  declType: string,
  name: string,
  rest: string
): string {
  const declaration = `${declType} ${name}${rest};`;
  const exportStatement = `\nexports.${name} = ${name};`;
  return `${declaration}${exportStatement}`;
}

export function replaceExportNamedList(
  match: string,
  exportsList: string
): string {
  const exportsArray = exportsList
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const exportStatements = exportsArray
    .map((name) => `exports.${name} = ${name};`)
    .join("\n");
  return exportStatements;
}

const replacements: Array<{
  regex: RegExp;
  replacer: (...args: any[]) => string;
}> = [
  {
    regex: IMPORT_DEFAULT_REGEX,
    replacer: replaceImportDefault,
  },
  {
    regex: IMPORT_NAMED_REGEX,
    replacer: replaceImportNamed,
  },
  {
    regex: IMPORT_NAMESPACE_REGEX,
    replacer: replaceImportNamespace,
  },
  {
    regex: IMPORT_SIDE_EFFECT_REGEX,
    replacer: replaceImportSideEffect,
  },
  {
    regex: EXPORT_DEFAULT_REGEX,
    replacer: replaceExportDefault,
  },
  {
    regex: EXPORT_NAMED_DECLARATION_REGEX,
    replacer: replaceExportNamedDeclaration,
  },
  {
    regex: EXPORT_NAMED_LIST_REGEX,
    replacer: replaceExportNamedList,
  },
];

export function convertToCjs(content: string): string {
  let transformed = content;

  replacements.forEach(({ regex, replacer }) => {
    transformed = transformed.replace(regex, replacer);
  });

  transformed = removeAccidentalSemicolons(transformed);

  return transformed;
}
