<script>
import gql from 'graphql-tag'
import { computed, ref } from '@vue/composition-api'
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

    // Back button
    const hover = ref(false)
    const showBack = computed(() => hover.value && root.$route.matched.length > 1)

    return {
      route,
      src,
      hover,
      showBack,
    }
  },
}
</script>

<template>
  <BaseButton
    class="link"
    :to="route"
    @mouseenter.native="hover = true"
    @mouseleave.native="hover = false"
  >
    <transition-group
      name="fade"
      class="relative w-8 h-8"
      tag="div"
    >
      <img
        v-if="src"
        v-show="!showBack"
        key="image"
        :src="src"
        class="w-full h-full rounded"
        alt="Logo"
      >
      <div
        v-show="showBack"
        key="arrow"
        class="absolute inset-0 bg-yellow-900 text-yellow-300 rounded-full flex items-center justify-center"
      >
        <i class="material-icons text-xl">home</i>
      </div>
    </transition-group>
  </BaseButton>
</template>
