<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import ProjectTypesGrid from './ProjectTypesGrid.vue'

import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { projectTypeFragment } from './fragments'

export default {
  components: {
    LoadingIndicator,
    ProjectTypesGrid,
  },

  setup () {
    const { result, loading } = useQuery(gql`
      query ProjectTypes {
        projectTypes {
          ...projectType
        }
      }
      ${projectTypeFragment}
    `)
    const projectTypes = useResult(result, [])

    const bookmarkedProjectTypes = computed(() => projectTypes.value.filter(pt => pt.bookmarked))
    const otherProjectTypes = computed(() => projectTypes.value.filter(pt => !pt.bookmarked))

    return {
      loading,
      bookmarkedProjectTypes,
      otherProjectTypes,
    }
  },
}
</script>

<template>
  <LoadingIndicator
    v-if="loading"
    class="py-16"
  />
  <div v-else>
    <template v-if="bookmarkedProjectTypes.length">
      <h2 class="mt-8 mb-4 text-gray-600 sm:text-xl">
        <i class="material-icons text-lg sm:text-2xl">bookmark</i>
        Bookmarked
      </h2>

      <ProjectTypesGrid
        :project-types="bookmarkedProjectTypes"
        class="mb-8"
      />
    </template>

    <hr
      v-if="bookmarkedProjectTypes.length && otherProjectTypes.length"
      class="border-gray-800"
    >

    <ProjectTypesGrid
      v-if="otherProjectTypes.length"
      :project-types="otherProjectTypes"
      class="my-8"
    />
  </div>
</template>
