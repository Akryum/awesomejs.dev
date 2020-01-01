<script>
import ProjectTypesItem from './ProjectTypesItem.vue'

export default {
  components: {
    ProjectTypesItem,
  },

  props: {
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
      <ProjectTypesItem
        :project-type="projectType"
      />
    </router-link>
  </div>
</template>
