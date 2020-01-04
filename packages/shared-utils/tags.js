"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSpecialTag(tag) {
    return tag === 'official' ||
        tag.startsWith('version:');
}
exports.isSpecialTag = isSpecialTag;
