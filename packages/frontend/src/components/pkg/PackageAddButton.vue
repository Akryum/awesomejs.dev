<template>
  <BaseButton
    v-tooltip="`Suggest a new package <span class='text-gray-500 font-mono'>${isMac ? '⌘' : 'Ctrl'}+A</span>`"
    :to="route"
    icon-left="add"
    class="px-4 py-2 bg-purple-900 text-purple-200 hover:bg-purple-800"
  >
    Package

    <GlobalEvents
      @keydown.ctrl.65.prevent="$router.push(route)"
    />
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

    route () {
      return {
        name: 'add-package',
        query: {
          projectTypeId: this.projectType ? this.projectType.id : null,
        },
      }
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
