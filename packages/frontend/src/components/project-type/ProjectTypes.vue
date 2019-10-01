<template>
  <LoadingIndicator
    v-if="$apollo.loading"
    class="py-16"
  />
  <div
    v-else
    class="project-types my-8"
  >
    <ProjectTypesItem
      v-for="projectType of projectTypes"
      :key="projectType.id"
      :project-type="projectType"
    />
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
}
</script>

<style lang="postcss" scoped>
.project-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, 128px);
  grid-gap: 48px;
}
</style>
