<script>
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { getNamedParents } from '@/util/router'
import { projectTypeFragment } from '../project-type/fragments'

export default {
  setup (props, { root }) {
    const hasProjectType = computed(() => !!root.$route.params.projectTypeSlug)

    const { result } = useQuery(gql`
      query ProjectType ($slug: String!) {
        projectType: projectTypeBySlug (slug: $slug) {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `, () => ({
      slug: root.$route.params.projectTypeSlug,
    }), () => ({
      enabled: !!hasProjectType.value,
    }))
    const projectType = useResult(result)

    const src = computed(() => {
      if (hasProjectType.value) {
        return projectType.value && projectType.value.logo
      }
      return require('@/assets/logo.png')
    })

    const route = computed(() => {
      if (root.$responsive.lg) {
        const parents = getNamedParents(root.$router.options.routes, root.$route.matched)
        if (parents.length) {
          return {
            name: parents[parents.length - 1].name,
          }
        }
      }
      return { name: 'home' }
    })

    return {
      route,
      src,
    }
  },
}
</script>

<template>
  <router-link :to="route">
    <img
      v-if="src"
      :src="src"
      class="w-8 h-8 rounded"
      alt="Logo"
    >
  </router-link>
</template>
