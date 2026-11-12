import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');
const GLOBAL_LOCALES_DIR = path.join(__dirname, '../locales');

/**
 * Get all modules that have a 'locales' folder
 * @returns List of module names
 */
export const getModulesWithLocales = (): string[] => {
  if (!fs.existsSync(MODULES_DIR)) return [];
  return fs.readdirSync(MODULES_DIR).filter((folder) => {
    const localesPath = path.join(MODULES_DIR, folder, 'locales');
    return fs.existsSync(localesPath) && fs.statSync(localesPath).isDirectory();
  });
};

/**
 * Get all global namespaces (folders inside src/locales)
 * @returns List of global namespace names
 */
export const getGlobalNamespaces = (): string[] => {
  if (!fs.existsSync(GLOBAL_LOCALES_DIR)) return [];
  return fs.readdirSync(GLOBAL_LOCALES_DIR).filter((folder) => {
    const folderPath = path.join(GLOBAL_LOCALES_DIR, folder);
    return fs.statSync(folderPath).isDirectory();
  });
};

/**
 * Get the JSON path for a given language and namespace
 * Tries module-specific first, then global, then empty.json fallback
 * @param lng Language code (e.g., 'en', 'am')
 * @param ns Namespace (module name or global folder name)
 * @returns Full path to JSON file
 */
export const getLocaleFilePath = (lng: string, ns: string): string => {
  const MODULES = getModulesWithLocales();
  const GLOBALS = getGlobalNamespaces();

  // 1️⃣ Module-specific
  if (MODULES.includes(ns)) {
    const modulePath = path.join(MODULES_DIR, ns, 'locales', `${lng}.json`);
    if (fs.existsSync(modulePath)) return modulePath;
  }

  // 2️⃣ Global namespace-specific
  if (GLOBALS.includes(ns)) {
    const globalPath = path.join(GLOBAL_LOCALES_DIR, ns, `${lng}.json`);
    if (fs.existsSync(globalPath)) return globalPath;
  }

  // 3️⃣ Empty fallback
  return path.join(GLOBAL_LOCALES_DIR, 'empty.json');
};
