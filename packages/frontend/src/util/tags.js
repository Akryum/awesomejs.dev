import { computed } from '@vue/composition-api'

export function useTags (pkg) {
  const tags = computed(() => pkg._tags || pkg.info.tags)
  const isOfficial = computed(() => tags.value.includes('official'))

  return {
    tags,
    isOfficial,
  }
}
