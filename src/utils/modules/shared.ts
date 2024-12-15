export function removeAccidentalSemicolons(value: string) {
  return value.replace(/;;+/g, ";");
}

export function sanitizeModuleName(moduleName: string): string {
  return moduleName.replace(/[-]/g, "_");
}
