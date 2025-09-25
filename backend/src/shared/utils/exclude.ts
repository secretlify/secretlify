// todo: remove, probably unused
export function exclude<T extends string | number>(source: T[], exclude: T[]): T[] {
  const sourceSet = new Set<T>(source);
  const excludeSet = new Set<T>(exclude);
  const excluded: T[] = [];

  for (const item of sourceSet) {
    if (!excludeSet.has(item)) {
      excluded.push(item);
    }
  }

  return excluded;
}
