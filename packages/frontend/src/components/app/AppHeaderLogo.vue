<template>
  <router-link :to="{ name: 'home' }">
    <img
      :src="src"
      class="w-8 h-8 rounded"
      alt="Logo"
    >
  </router-link>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from '../project-type/fragments'

export default {
  computed: {
    hasProjectType () {
      return !!this.$route.params.projectTypeSlug
    },

    src () {
      if (this.hasProjectType && this.projectType) {
        return this.projectType.logo
      }
      return require('@/assets/logo.png')
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
          slug: this.$route.params.projectTypeSlug,
        }
      },
      skip () {
        return !this.hasProjectType
      },
    },
  },
}
</script>
