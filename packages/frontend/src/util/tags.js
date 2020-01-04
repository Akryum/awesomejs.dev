import { computed } from '@vue/composition-api'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

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

export function useAvailableTags (projectTypeIdRef, formTags) {
  if (typeof projectTypeIdRef === 'function') {
    projectTypeIdRef = computed(projectTypeIdRef)
  }
  if (typeof formTags === 'function') {
    formTags = computed(formTags)
  }
  const { result: projectTypeResult } = useQuery(gql`
    query ProjectTypeTags ($id: ID!) {
      projectType (id: $id) {
        id
        tags {
          id
        }
      }
    }
  `, () => ({
    id: projectTypeIdRef.value,
  }), () => ({
    enabled: !!projectTypeIdRef.value,
  }))
  const availableTags = computed(() => {
    return Array.from(new Set([
      ...formTags.value,
      ...projectTypeResult.value ? projectTypeResult.value.projectType.tags.map(t => t.id) : [],
    ]))
  })

  return {
    availableTags,
  }
}
