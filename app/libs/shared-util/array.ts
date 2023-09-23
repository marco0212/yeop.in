export function isNotEmpty<T>(value: T | undefined | null): value is T {
  if (value === null || value === undefined) {
    return false;
  }

  return true;
}
