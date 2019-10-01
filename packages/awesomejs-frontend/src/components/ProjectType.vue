<template>
  <div v-if="projectType">
    <PageTitle>
      Awesome {{ projectType.name }} packages
    </PageTitle>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue'
import gql from 'graphql-tag'

export default {
  components: {
    PageTitle,
  },

  props: {
    projectTypeSlug: {
      type: String,
      required: true,
    },
  },

  apollo: {
    projectType: {
      query: gql`
        query ProjectType ($slug: String!) {
          projectType (slug: $slug) {
            id
            name
            slug
            logo
          }
        }
      `,
      variables () {
        return {
          slug: this.projectTypeSlug,
        }
      },
    },
  },
}
</script>
