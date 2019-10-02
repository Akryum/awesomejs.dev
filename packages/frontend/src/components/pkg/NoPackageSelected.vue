<template>
  <div class="text-center my-8">
    <div
      v-if="projectType"
      class="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
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

<script>
import gql from 'graphql-tag'
import { projectType } from '../project-type/fragments'

export default {
  apollo: {
    projectType: {
      query: gql`
        query ProjectType ($slug: String!) {
          projectType (slug: $slug) {
            ...projectType
          }
        }
        ${projectType}
      `,
      variables () {
        return {
          slug: this.$route.params.projectTypeSlug,
        }
      },
    },
  },
}
</script>
