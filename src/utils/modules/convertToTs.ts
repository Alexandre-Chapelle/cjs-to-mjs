import { removeAccidentalSemicolons, sanitizeModuleName } from "./shared";

export const DESTRUCTURED_REQUIRE_REGEX =
  /const\s+\{\s*([a-zA-Z0-9_,\s]+)\s*\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g;
export const DEFAULT_REQUIRE_REGEX =
  /const\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g;
export const REQUIRE_INVOKE_REGEX = /require\(['"]([^'"]+)['"]\)\(([^)]*)\);?/g;
export const REQUIRE_METHOD_REGEX =
  /require\(['"]([^'"]+)['"]\)\.([a-zA-Z0-9_]+)\(([^)]*)\);?/g;
export const MODULE_EXPORTS_REGEX = /module\.exports\s*=\s*(.+);?/g;
export const EXPORTS_REGEX = /exports\.([a-zA-Z0-9_]+)\s*=\s*(.+);?/g;

export function replaceDestructuredRequire(
  match: string,
  imports: string,
  module: string
): string {
  return `import { ${imports} } from '${module}';`;
}

export function replaceDefaultRequire(
  match: string,
  varName: string,
  module: string
): string {
  return `import ${varName} from '${module}';`;
}

export function replaceRequireInvoke(
  match: string,
  module: string,
  args: string
): string {
  const importName = `${sanitizeModuleName(module)}Module`;
  return `import ${importName} from '${module}';\n${importName}(${args});`;
}

export function replaceRequireMethod(
  match: string,
  module: string,
  method: string,
  args: string
): string {
  const importName = `${sanitizeModuleName(module)}Module`;
  return `import ${importName} from '${module}';\n${importName}.${method}(${args});`;
}

export function replaceModuleExports(match: string, exports: string): string {
  return `export default ${exports};`;
}

export function replaceExports(
  match: string,
  name: string,
  value: string
): string {
  return `export const ${name} = ${value};`;
}

const replacements: Array<{
  regex: RegExp;
  replacer: (...args: any[]) => string;
}> = [
  {
    regex: DESTRUCTURED_REQUIRE_REGEX,
    replacer: replaceDestructuredRequire,
  },
  {
    regex: DEFAULT_REQUIRE_REGEX,
    replacer: replaceDefaultRequire,
  },
  {
    regex: REQUIRE_INVOKE_REGEX,
    replacer: replaceRequireInvoke,
  },
  {
    regex: REQUIRE_METHOD_REGEX,
    replacer: replaceRequireMethod,
  },
  {
    regex: MODULE_EXPORTS_REGEX,
    replacer: replaceModuleExports,
  },
  {
    regex: EXPORTS_REGEX,
    replacer: replaceExports,
  },
];

export function convertToTs(content: string): string {
  let transformed = content;

  replacements.forEach(({ regex, replacer }) => {
    transformed = transformed.replace(regex, replacer);
  });

  transformed = removeAccidentalSemicolons(transformed);

  return transformed;
}
