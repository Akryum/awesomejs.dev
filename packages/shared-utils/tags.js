export function isSpecialTag(tag) {
    return tag === 'official' ||
        tag.startsWith('version:');
}
