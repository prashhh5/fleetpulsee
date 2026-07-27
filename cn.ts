type ClassValue = string | number | null | boolean | undefined;

// Deliberately simple: no Tailwind conflict resolution like tailwind-merge
// does, just joins truthy class names. Enough for a project this size
// without pulling in another dependency.
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
