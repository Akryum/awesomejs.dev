<template>
  <BaseButton
    :to="{
      name: 'add-package',
      query: {
        projectTypeId: projectType ? projectType.id : null,
      },
    }"
    icon-left="add"
    class="px-4 py-1 text-gray-500 hover:text-gray-400"
  >
    Add package
  </BaseButton>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from '../project-type/fragments'

export default {
  computed: {
    projectTypeSlug () {
      return this.$route.params.projectTypeSlug
    },
  },

  apollo: {
    projectType: {
      query: gql`
        query ProjectType ($slug: String!) {
          projectType: projectTypeBySlug (slug: $slug) {
            ...projectType
          }
        }
        ${projectType}
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
      skip () {
        return !this.projectTypeSlug
      },
    },
  },
}
</script>
