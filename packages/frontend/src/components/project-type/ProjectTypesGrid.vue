<script>
import ProjectTypesItem from './ProjectTypesItem.vue'
import ProjectProposalItem from './ProjectProposalItem.vue'

export default {
  components: {
    ProjectTypesItem,
    ProjectProposalItem,
  },

  props: {
    projectComponentItem: {
      type: String,
      default: 'ProjectTypesItem',
    },
    projectTypes: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div
    class="project-types-grid"
  >
    <router-link
      v-for="projectType of projectTypes"
      :key="projectType.id"
      :to="{
        name: 'project-type',
        params: {
          projectTypeSlug: projectType.slug
        }
      }"
    >
      <component
        :is="projectComponentItem"
        :project-type="projectType"
      />
    </router-link>
  </div>
</template>
