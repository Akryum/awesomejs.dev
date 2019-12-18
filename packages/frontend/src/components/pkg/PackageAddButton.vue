<script>
import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { isMac } from '@/util/env'
import { projectTypeFragment } from '../project-type/fragments'

export default {
  setup (props, { root }) {
    const projectTypeSlug = computed(() => root.$route.params.projectTypeSlug)

    const { result } = useQuery(gql`
      query ProjectType ($slug: String!) {
        projectType: projectTypeBySlug (slug: $slug) {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `, () => ({
      slug: projectTypeSlug.value,
    }), () => ({
      enabled: !!projectTypeSlug.value,
    }))
    const projectType = useResult(result)

    const route = computed(() => ({
      name: 'add-package',
      query: {
        projectTypeId: projectType.value ? projectType.value.id : null,
      },
    }))

    return {
      route,
      isMac,
    }
  },
}
</script>

<template>
  <BaseButton
    v-tooltip="`Suggest a new package <span class='text-gray-600 font-mono'>${isMac ? '⌘' : 'Ctrl'}+Shift+A</span>`"
    :to="route"
    icon-left="add"
    class="px-4 py-2 bg-purple-900 text-purple-200 hover:bg-purple-800"
  >
    Package

    <GlobalEvents
      @keydown.ctrl.shift.65.prevent="$router.push(route)"
    />
  </BaseButton>
</template>
