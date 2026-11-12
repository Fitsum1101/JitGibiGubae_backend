/**
 * Converts a value to a boolean if possible.
 * Returns `true` for true/"true", `false` for false/"false", and `undefined` otherwise.
 */

import type { BooleanLike } from "../types/booleanUtil";

export function boolean(value: BooleanLike): boolean | undefined {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}
