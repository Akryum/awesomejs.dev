<template>
  <router-link :to="route">
    <img
      v-if="src"
      :src="src"
      class="w-8 h-8 rounded"
      alt="Logo"
    >
  </router-link>
</template>

<script>
import gql from 'graphql-tag'
import { projectType } from '../project-type/fragments'
import { getNamedParents } from '@/util/router'

export default {
  computed: {
    hasProjectType () {
      return !!this.$route.params.projectTypeSlug
    },

    src () {
      if (this.hasProjectType) {
        return this.projectType && this.projectType.logo
      }
      return require('@/assets/logo.png')
    },

    route () {
      if (this.$responsive.md) {
        const parents = getNamedParents(this.$router.options.routes, this.$route.matched)
        if (parents.length) {
          return {
            name: parents[parents.length - 1].name,
          }
        }
      }
      return { name: 'home' }
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
