export function getSafeNextPath(nextValue: string | null | undefined, fallback = "/feed") {
  if (!nextValue || !nextValue.startsWith("/") || nextValue.startsWith("//")) {
    return fallback;
  }

  return nextValue;
}
