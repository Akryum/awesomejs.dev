import { ref, computed, watch } from '@vue/composition-api'

const joypixels = () => import(
  /* webpackChunkName: "emoji-toolkit" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: 100 */
  /* webpackPreload: 100 */
  'emoji-toolkit'
)

export function useEmoji (sourceText) {
  const sourceRef = typeof sourceText === 'function' ? computed(sourceText) : sourceText
  const parsedText = ref(sourceRef.value)

  watch(sourceRef, async value => {
    const { default: emoji } = await joypixels()
    parsedText.value = emoji.shortnameToUnicode(sourceRef.value)
  })

  return {
    parsedText,
  }
}
