export function sanitizeTags (tags: string[]) {
  return Array.from(new Set(tags.map((t) => t.trim()).filter((t) => t.length)))
}
