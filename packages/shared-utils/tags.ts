export function isSpecialTag (tag: string) {
  return tag === 'official' ||
    tag.startsWith('version:')
}
