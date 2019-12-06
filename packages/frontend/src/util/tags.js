import { computed } from '@vue/composition-api'

export function useTags (pkg) {
  if (typeof pkg === 'function') {
    pkg = computed(pkg)
  }
  const tags = computed(() => pkg.value._tags || pkg.value.info.tags)
  const isOfficial = computed(() => tags.value.includes('official'))

  return {
    tags,
    isOfficial,
  }
}
