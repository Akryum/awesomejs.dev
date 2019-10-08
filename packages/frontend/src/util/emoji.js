import emojione from 'emojione'

export function parseEmoji (text) {
  return emojione.shortnameToUnicode(text)
}
