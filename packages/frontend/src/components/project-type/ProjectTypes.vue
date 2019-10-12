<template>
  <LoadingIndicator
    v-if="$apollo.loading"
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

<script>
import gql from 'graphql-tag'
import LoadingIndicator from '../LoadingIndicator.vue'
import ProjectTypesItem from './ProjectTypesItem.vue'
import { projectType } from './fragments'

export default {
  components: {
    LoadingIndicator,
    ProjectTypesItem,
  },

  data () {
    return {
      projectTypes: [],
    }
  },

  apollo: {
    projectTypes: gql`
      query ProjectTypes {
        projectTypes {
          ...projectType
        }
      }
      ${projectType}
    `,
  },

  computed: {
    sortedProjectTypes () {
      return this.projectTypes.slice().sort((a, b) => {
        if (a.bookmarked === b.bookmarked) {
          return 0
        } else if (a.bookmarked) {
          return -1
        } else {
          return 1
        }
      })
    },
  },
}
</script>
