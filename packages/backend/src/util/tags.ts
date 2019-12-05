export function sanitizeTags (tags: string[]) {
  return tags.map((t) => t.trim()).filter((t) => t.length)
}
