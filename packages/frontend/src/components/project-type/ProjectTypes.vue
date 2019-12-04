<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import ProjectTypesItem from './ProjectTypesItem.vue'

import gql from 'graphql-tag'
import { computed } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { projectTypeFragment } from './fragments'

export default {
  components: {
    LoadingIndicator,
    ProjectTypesItem,
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

    const sortedProjectTypes = computed(() => projectTypes.value.slice().sort((a, b) => {
      if (a.bookmarked === b.bookmarked) {
        return 0
      } else if (a.bookmarked) {
        return -1
      } else {
        return 1
      }
    }))

    return {
      loading,
      sortedProjectTypes,
    }
  },
}
</script>

<template>
  <LoadingIndicator
    v-if="loading"
    class="py-16"
  />
  <div
    v-else
    class="project-types-grid my-4 sm:my-8"
  >
    <router-link
      v-for="projectType of sortedProjectTypes"
      :key="projectType.id"
      :to="{
        name: 'project-type',
        params: {
          projectTypeSlug: projectType.slug
        }
      }"
    >
      <ProjectTypesItem
        :project-type="projectType"
      />
    </router-link>
  </div>
</template>
