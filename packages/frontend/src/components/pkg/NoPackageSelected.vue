<script>
import gql from 'graphql-tag'
import { projectTypeFragment } from '../project-type/fragments'
import { useQuery, useResult } from '@vue/apollo-composable'

export default {
  setup (props, { root }) {
    const { result } = useQuery(gql`
      query ProjectType ($slug: String!) {
        projectType: projectTypeBySlug (slug: $slug) {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `, () => ({
      slug: root.$route.params.projectTypeSlug,
    }))
    const projectType = useResult(result)

    return {
      projectType,
    }
  },
}
</script>

<template>
  <div class="text-center my-8">
    <div
      v-if="projectType"
      class="logo mx-auto mb-6 flex items-center justify-center"
    >
      <img
        :src="projectType.logo"
        :alt="`${projectType.name} logo`"
        class="max-w-full max-h-full rounded"
      >
    </div>

    <h1 class="text-xl font-light text-gray-600">
      <i class="material-icons mr-2 text-gray-700">arrow_back</i>
      <span>Select a package to continue</span>
    </h1>
  </div>
</template>

<style lang="postcss" scoped>
.logo {
  width: 100px;
  height: 100px;
}
</style>
