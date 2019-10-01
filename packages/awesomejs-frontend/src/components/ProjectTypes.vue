<template>
  <div
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

import ProjectTypesItem from './ProjectTypesItem.vue'

export default {
  components: {
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
          id
          name
          slug
          logo
        }
      }
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
